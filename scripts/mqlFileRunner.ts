// mqlFileRunner.ts
import "dotenv/config";
import { spawnSync } from "child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const container = process.env.MONGODB_CONTAINER!;
const user = process.env.MONGODB_USER!;
const password = process.env.MONGODB_PASSWORD!;
const authDb = process.env.MONGODB_AUTH_DB!;
const database = process.env.MONGODB_DB_NAME!;

const argv = process.argv.slice(2);

// MQL(=mongosh script) ファイルのパスを取得
const mqlFile = argv[0];
if (!mqlFile) {
  process.stderr.write("MQL file path is required.\n");
  process.exit(1);
}

const abs = resolve(mqlFile);
if (!existsSync(abs)) {
  process.stderr.write(`MQL file not found: ${abs}\n`);
  process.exit(1);
}

// mongosh 接続URI（コンテナ内から見た localhost でOK：docker exec でコンテナ内実行するため）
const uri = `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(
  password
)}@localhost:27017/${authDb}`;

// docker exec 引数を組み立て
const args: string[] = ["exec", "-i"];

args.push(
  container,
  "mongosh",
  uri,
  "--quiet",
  "--eval",
  `db = db.getSiblingDB(${JSON.stringify(database)})`,
  "--file",
  "/dev/stdin" // stdin から読む（PowerShellでも < リダイレクト不要）
);

// 実行
const res = spawnSync("docker", args, {
  input: readFileSync(abs, "utf-8"),
  encoding: "utf-8",
});

// 成功時は mongosh の標準出力をそのまま返して終了
if (res.status === 0) {
  if (res.stdout) process.stdout.write(res.stdout);
  process.exit(0);
}

// 失敗時: mongosh のエラーまたは docker のエラーを出す
if (res.stderr && res.stderr.trim().length > 0) {
  process.stderr.write(res.stderr);
} else if (res.error) {
  process.stderr.write(`Failed to run docker/mongosh: ${res.error.message}\n`);
}
process.exit(typeof res.status === "number" ? res.status : 1);

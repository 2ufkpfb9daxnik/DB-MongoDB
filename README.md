
2025年度「データベース工学」の MongoDB に関する教材 (演習環境) です。

## 動作環境

この教材は、次の環境で動作確認を行なっています。

- OS: Windows 11 (WSL2)
- Docker Desktop: 4.58
- Node.js: 24.8
- Git: 2.51.0.windows.1
- Visual Studio Code: 1.108

## セットアップ手順

### リポジトリのクローン

次のコマンドで、このリポジトリをクローンします。

```bash
git clone https://github.com/TakeshiWada1980/DB-2025-MongoDB.git
cd DB-2025-MongoDB
```

上記のコマンドを実行すると、カレントフォルダのなかに `DB-2025-MongoDB` というフォルダが作成され、そこにプロジェクトが展開されます。

クローン先のフォルダ名を変更したいときは (例えば `hoge` というフォルダを新規作成して、そこに展開にしたいときは)、次のようにしてください。

```bash
git clone https://github.com/TakeshiWada1980/DB-2025-MongoDBL.git hoge
cd hoge
```

### 依存関係のインストール

次のコマンドを実行して、プロジェクトの実行に必要なパッケージをインストールしてください。`npm i` は `npm install` の短縮形です。

```bash
npm i
```

### 環境変数の設定

プロジェクトのルートフォルダに `.env` (環境変数の設定ファイル) を新規作成してください。`.env.dummy` を参考に、次のように記述してください。

```env
MONGODB_URI="mongodb://student:secret123@localhost:27017/admin"
MONGODB_CONTAINER="mongo8"
MONGODB_AUTH_DB="admin"
MONGODB_DB_NAME="playground"

# [student] には、MongoDB のユーザ名を指定してください。
# [secret123] には、MongoDB のパスワードを指定してください。
MONGODB_USER="student"
MONGODB_PASSWORD="secret123"
```

上記の環境変数は `docker/docker-compose.yaml` のデフォルト設定に対応しています。`docker/docker-compose.yaml` を変更したときは、それにあわせて、次の値を変更してください。

- `student` : 学習用 MongoDB のユーザ名
- `secret123` : 学習用 MongoDB のパスワード
- `playground` : 学習用 MongoDB のデフォルトデータベース名

### リモートリポジトリの設定

[GitHub](https://github.com/) に空の **パブリックリポジトリ** を作成してください。このとき、`README.md`、`.gitignore`、`LICENSE` などは含めずに、**完全に空の状態で作成**するようにしてください。

- リポジトリの例: `https://github.com/xxxx/DB-MongoDB.git`

次のコマンドで、教材提供のリモートリポジトリを `upstream` という名前に変更します。

```bash
git remote rename origin upstream
```

つづいて、自分のリモートリポジトリを `origin` という名前で追加し、初回の `push` を実行します。

```bash
git remote add origin https://github.com/xxxx/DB-MongoDB.git
git push -u origin main
```

ウェブブラウザから、https://github.com/xxxx/DB-MongoDB.git にアクセスして、プッシュに成功していることを確認してください。

#### 教材の更新を取得するとき

教材リポジトリ (`upstream`) に更新があった場合は、次のコマンドで最新の変更を取得してください。

```bash
git fetch upstream
git switch main
git merge upstream/main
```

マージ処理では、以下のようにエディタが自動的に起動することがあります。内容を確認したうえで、「続行」ボタンを押下してください。

![img](./docs/figs/readme/git-01.png)

マージ完了後、`MERGE_MSG` のタブは閉じて問題ありません。その後、VSCodeの「変更の同期」のボタンを押下して、自分のリモートリポジトリ (`origin`) に変更を反映させてください。

#### 自分の GitHub に演習課題などを保存するとき

演習や課題の取り組みを、自分のリモートリポジトリに保存するときは、次のコマンドを実行してください。

```bash
git add .
git commit -m "任意のコミットメッセージ"
git push
```

## 教材の使用方法 (MongoDBの実行方法)

### 準備: Docker Desktop の起動確認

タスクトレイのアイコンから Docker Desktop が起動していることを確認してください。

### 準備: MongoDB と mongo-express の起動

VSCode でプロジェクトフォルダを開き、`[Ctrl]+[J]` を押下してターミナル (PowerShell) を起動してください。つづいて、次のコマンドを実行して MongoDB と mongo-express の Dockerコンテナ を起動してください。

```bash
npm run db:up
```

上記は `package.json` の `scripts` に定義されたコマンドで、実際には次のコマンドが実行されます。

```bash
docker compose -f docker/docker-compose.yaml -p mongo8dev up -d --wait
```

### mongosh ファイルの実行

mongosh ファイルは、拡張子を `mongosh.js` として、基本的に `mongosh` フォルダのなかに配置してください。必要に応じて`mongosh` フォルダのなかにサブフォルダを作成してください。

例えば、`mongosh/14/sample.mongosh.js` というファイルを作成したときは、次のコマンドで SQLファイル が実行できます。

```bash
npm run mql mongosh/14/sample.mongosh.js
```

また、`.vscode/tasks.json` にビルドタスクを定義しているので、`create-s_users.mongosh.js` のエディタタブがアクティブな状態で `[Ctrl]+[Shift]+[B]` を押下することでも、上記コマンドを実行することができます。

### TypeScriptファイルの実行

TypeScriptファイル ([mongodb](https://www.npmjs.com/package/mongodb)や[mongoose](https://www.npmjs.com/package/mongoose)などのライブラリを使ってMongoDBを操作する場合) は、基本的に `src` フォルダのなかに、必要に応じてサブフォルダを作成して配置してください。

例えば、`src/samples/helloWorld.ts` というファイルを作成したときは、次のコマンドにより、プログラムの実行ができます。

```bash
npx tsx src/samples/helloWorld.ts
```

また、ファイルの変更を検知して自動的に再実行したい場合 (=ホットリロードを利用する場合) は、次のコマンドを使用してください。停止する場合は、ターミナル上で `[Ctrl+C]` を入力してください。

```bash
npx tsx watch src/samples/helloWorld.ts
```

または、次のように npm スクリプト経由で実行することもできます。

```bash
npm run dev src/samples/helloWorld.ts
```

### mongo-express の利用

ウェブブラウザで `http://localhost:8081/` にアクセスすることで mongo-express を利用できます。mongo-express は、データベースの内容を視覚的に確認したり、クエリを発効することができるウェブベースの GUIツール です。

### MongoDB と mongo-express の停止

次のコマンドで、コンテナを停止します。

```bash
npm run db:down
```

コンテナを停止しても、データベース内のデータは Docker のボリュームに保存されたまま残ります。そのため、次回 `npm run db:up` でコンテナを再起動すれば、前回のデータをそのまま利用できます。

データベースを初期状態に戻したい場合 (ボリュームを含めてすべて削除したい場合) は、次のコマンドを実行してください。

```bash
npm run db:reset
```

**補足**: `npm run db:reset` を実行すると、これまでに作成したテーブルやデータがすべて消去されます。演習をやり直したいときや、データベースの状態をクリーンにしたいときに使用してください。
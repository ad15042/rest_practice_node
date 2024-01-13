const express = require('express');
const app = express();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
uuidv4();
var methodOverride = require('method-override')



// formデータをパースする
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// jsonデータをパースする
app.use(express.json()) // for parsing application/json
// POSTメソッドをPATCHメソッドでオーバーライドする
app.use(methodOverride('_method')) // _methodは何でも良いが、formのactionで渡すクエリストリングと同じにすること。
// viewsのディレクトリを設定する
app.set('views', path.join(__dirname, 'views'));
// ejsを設定する
app.set('view engine', "ejs");


// ダミーデータを作成
let commentDummyData = [
    {
        id: uuidv4(),
        username: 'yamada',
        comment: 'RESTful APIを作成中'
    },
    {
        id: uuidv4(),
        username: 'sato',
        comment: '何で勉強しているんですか？'
    },
    {
        id: uuidv4(),
        username: 'yamada',
        comment: 'UDEMYで勉強しています。'
    },
    {
        id: uuidv4(),
        username: 'sakurai',
        comment: 'いいですね！'
    },
];


//　①コメント一覧を表示するためのルーティング
app.get('/comments', (req, res) => {
    // コメントデータを渡す
    res.render('comments/index', { commentDummyData });
})

// ②コメント新規作成用ページを表示するためのルーティング
app.get('/comments/new', (req, res) => {
    res.render('comments/new')
})

// ③コメントを新規作成するためのルーティング
app.post('/comments', (req, res) => {
    // リクエストボディからユーザ名とコメントだけを取得
    const { username, comment } = req.body;
    // ダミーデータの配列に追加
    commentDummyData.push({ username, comment, id: uuidv4() });
    // コメントの一覧ページにリダイレクトする
    res.redirect('/comments');
})

// ④コメントの詳細ページを表示するルーティング
app.get('/comments/:id', (req, res) => {
    const { id } = req.params;
    // findコマンドで一致したidのオブジェクトを取得
    const comment = commentDummyData.find(c => c.id === id);
    res.render('comments/show', { comment });

})

// ⑤特定のコメントを編集するためのフォームに遷移するルーテイング
app.get('/comments/:id/edit', (req, res) => {
    const { id } = req.params;
    // findコマンドで一致したidのオブジェクトを取得
    // コメントを編集するために、対象のコメントを取得する
    const comment = commentDummyData.find(c => c.id === id);
    // 更新用のページに遷移
    res.render('comments/edit', { comment });
})

// ⑥コメントを更新するルーティング
app.patch('/comments/:id', (req, res) => {
    const { id } = req.params;
    // リクエストボディの中にある変更後のテキストを取得
    const newCommentText = req.body.comment;
    // findコマンドで現在のコメントを取得
    const oldComment = commentDummyData.find(c => c.id === id);
    // 新しいコメントで古いコメントを上書きする
    oldComment.comment = newCommentText;
    // コメント一覧にリダイレクト
    res.redirect('/comments');
})

// ⑦コメントを削除するルーティング
app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;
    // 取得したid"以外"の配列を新規作成する
    commentDummyData = commentDummyData.filter((c) => c.id != id);
    // コメント一覧にリダイレクト
    res.redirect('/comments');

})

// // GET Method
// app.get('/tacos', (req, res) => {
//     res.send('GET /tacos responce');
// })


// // POST Method
// app.post('/tacos', (req, res) => {
//     const { meat, qty } = req.body;
//     res.send(`${qty}個の${meat}を提供します。`);

// })


app.listen(3000, () => {
    console.log('ポート3000で待ち受け中!!')

})


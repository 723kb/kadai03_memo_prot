// メモを表示する関数 引数key memoDataを渡すのでテンプレートリテラル内で使える
// key メモを識別するための鍵
// memoData メモの内容を格納したオブジェクト
function displayMemo(key, memoData) {
  const html = `
    <li data-key="${key}">
      <p class="memo-title">タイトル：${memoData.title}</p>
      <p class="memo-text">本文：${memoData.text.replace(/\n/g, '<br>')}</p>
      <p class="memo-created">登録時間：${memoData.createdAt}</p>
      <p class="memo-updated">最終編集時間：${memoData.updatedAt}</p>
      <div class="flex flex-row justify-end">
      <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
      <button class="delete" data-key="${key}"><i class="fa-regular fa-trash-can"></i></button>
      </div>
    </li>
  `;
  const $element = $(html);
  //html変数に格納された文字列をjQueryオブジェクトに変換

  // 以下テンプレートリテラル内のTailwind CSS
  // 直接記載すると視認性が悪いためJavaScriptで動的に追加
  $element.addClass('m-5 p-2 border-solid border-2 border-slate-500 rounded-xl hover:bg-pink-50');
  $element.find('.memo-title').addClass('m-2');
  $element.find('.memo-text').addClass('m-2');
  $element.find('.memo-created').addClass('m-2 text-end');
  $element.find('.memo-updated').addClass('m-2 text-end');
  $element.find('.edit').addClass('text-lg text-center h-8 w-16 m-2 border-solid border-2 border-slate-500 rounded-xl hover:bg-green-400');
  $element.find('.delete').addClass('text-lg text-center h-8 w-16 m-2 border-solid border-2 border-slate-500 rounded-xl hover:bg-red-400');
  // ここまでcssのこと

  // 4. Edit クリックイベント
$element.find(".edit").on("click", function () {
  // クリックされたeditボタンに1番近い親要素のliを取得
  const li = $(this).closest("li");
  // li要素のdata-key属性からキーを取得→メモデータを特定
  const key = li.data("key");
  // キーを使ってローカルストレージからメモデータ取得→JSONからオブジェクトに変換
  const memoData = JSON.parse(localStorage.getItem(key));
  // promptメソッドで新しい本文入力を求める 初期値で既存の本文が表示
  const newText = prompt("新しい本文を入力してください", memoData.text);
  // newTextがnullでない（キャンセルを押さず入力完了した）場合は以下の処理実行
  if (newText !== null) {
    // 入力された新しい本文をメモデータに設定
    memoData.text = newText;
    // メモの更新日時を現在のローカライズされた日時に更新
    memoData.updatedAt = new Date().toLocaleString();
    // 更新されたメモデータをJSON形式でローカルストレージに保存
    localStorage.setItem(key, JSON.stringify(memoData));
    // findメソッド
    // li要素の中からクラス名が一致するものを見つける→それぞれ書き換える
    li.find('.memo-text').text(`本文： ${memoData.text}`);
    li.find('.memo-updated').text(`最終編集時間： ${memoData.updatedAt}`);
  }
});

// 5. Delete クリックイベント
$element.find(".delete").on("click", function () {
  // deleteボタンに関連づけられたdata-key属性の値を取得→削除対象のメモのキーのこと
  const key = $(this).data("key");
  // クリックされたdeleteボタンに1番近い親要素のliを取得→画面から表示を削除
  $(this).closest("li").remove();
  // ローカルストレージから削除対象のメモデータを削除
  localStorage.removeItem(key);
});


  // リストの上に追加 新しいものが上になる
  $("#list").prepend($element);
}

// 1. Save クリックイベント
$("#save").on("click", function () {
  // #titleの値を取得して変数に格納
  const title = $("#title").val();
  // #textの値を取得して変数に格納
  const text = $("#text").val();
  // UUIDを生成してキーとして使用
  const key = generateUUID();
  // 現在の日時をローカライズされた文字列形式で取得して変数に格納
  const now = new Date().toLocaleString();
  // 上記で取得したものを含むオブジェクトを作成
  const memoData = {
    title: title,
    text: text,
    createdAt: now,
    updatedAt: now
  };
  // memoDataオブジェクトをJSON文字列に変換し、ローカルストレージにキーとともに保存
  localStorage.setItem(key, JSON.stringify(memoData));
  // メモを表示する関数を呼び出す
  displayMemo(key, memoData);
  // ボタンが押された後に、中身を削除する
  $("#title").val("");
  $("#text").val("");
});

// Enterキーでの登録を実装
// 改行したいときに不便なので一旦なしにする
// $('#text').keypress(function (e) {
//   if (e.which == 13) { // Enterキーが押された場合
//     $("#save").click(); // 保存ボタンのクリックをトリガーする
//   }
// });

// Enterキーでの登録を無効化するための修正
$('#text').keypress(function (e) {
  if (e.which == 13 && !e.shiftKey) { // Enterキーが押された場合（Shiftキーが押されていない場合）
    e.preventDefault(); // デフォルトのEnterキー動作を無効化
  }
});

// 以下UUID生成関数
// ToDoの方のデータと混ざらないようにランダムキー設定
function generateUUID() {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

// 2. Clear クリックイベント
$("#clear").on("click", function () {
  localStorage.clear();
  $("#list").empty();
});

// 3. ページ読み込み時：保存データ取得表示
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, "鍵の名前")
  // メモに反映されないよう'todos'キーの場合は無視する
  if (key !== 'todos') {
    // 指定されたキーに対応する値を取得し、文字列化されたJSONをオブジェクトに変換
    const memoData = JSON.parse(localStorage.getItem(key));
    console.log(memoData, "メモの内容")
    displayMemo(key, memoData);
  }
}

$(function(){
  //フッターを最下部に固定
      var $footer = $('#footer');
      if(window.innerHeight > $footer.offset().top + $footer.outerHeight() ) {
          $footer.attr({'style': 'position:fixed; top:' + (window.innerHeight - $footer.outerHeight()) + 'px;' });
      }
  })


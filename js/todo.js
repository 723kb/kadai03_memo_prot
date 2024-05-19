$(document).ready(function () {
  // 追加ボタンのクリックイベントを定義
  $('#addTodo').click(function () {
    addTodo();
  });

  // Enterキーでの追加
  $('#todoInput').keypress(function (e) {
    if (e.which == 13) {
      addTodo();
    }
  });

  // 削除ボタンのクリックイベントを定義
  $(document).on('click', '.delete', function () {
    $(this).parent().remove();
    saveTodos();
  });

  // リスト追加時の関数
  function addTodo() {
    // #todoInputからテキストを取得し、トリミングして変数に格納
    const todoText = $('#todoInput').val().trim();
    // todotextがからでない時に以下実行
    if (todoText) {
      // リストアイテムを生成
      const li = $('<li>');
      //  ToDoの内容を表すテキストを生成し、変数に格納
      const todoSpan = $('<span>').text(todoText);
      // 削除ボタンを生成
      const deleteButton = $('<button>').addClass('delete').text('削除');
      // リストアイテムにToDoの内容と削除ボタンを追加
      li.append(todoSpan, deleteButton);
      // リストにToDoを追加
      $('#todoList').append(li);
      // 入力フィールドをクリア
      $('#todoInput').val('');
      saveTodos();
    }
  }
  // ローカルストレージに保存する関数
  function saveTodos() {
    const todos = [];
    // liに対してループ実行
    // liアイテムのテキストを取得し配列にオブジェクトとして追加
    $('#todoList li').each(function () {
      todos.push({
        text: $(this).find('span').text()
      });
    });
    // todos配列をJSON文字列に変換してローカルストレージにキーtodosとして保存
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  // 読み込み時の関数
  function loadTodos() {
    // キーがtodosの値を取得
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    // foreachメソッドでループ処理
    todos.forEach(function (todo) {
      // リストアイテムを生成
      const li = $('<li>');
      // ToDoの内容を表すテキストを生成
      const todoSpan = $('<span>').text(todo.text);
      // 削除ボタンを生成
      const deleteButton = $('<button>').addClass('delete').text('削除');
      // リストアイテムにToDoの内容と削除ボタンを追加
      li.append(todoSpan, deleteButton);
      // リストにToDoを追加
      $('#todoList').append(li);
    });
  }

  // ページロード時に保存されたToDoリストを読み込む
  loadTodos();
});

var loggedInUserID = ""
window.addEventListener('load', function () {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.getElementsByClassName('needs-validation');
  var validation = Array.prototype.filter.call(forms, function (form) {
    form.addEventListener('submit', function (event) {
      if (form.checkValidity() === false) {//invalid input
        event.preventDefault();
        event.stopPropagation();
      }
      else {//valid
        event.preventDefault();
        event.stopPropagation();
        // if(checkAuth()){//user exists
        //   document.getElementById("login-page").style.visibility = "hidden";
        // }
        // else{
        //   document.getElementById("user-not-exist-error").hidden = false;
        // }
      }
      form.classList.add('was-validated');
    }, false);
  });
}, false);
function registerScreen() {
  document.getElementById("register-form").hidden = false;
  document.getElementById("login-form").hidden = true;
  document.getElementById("login-header").innerHTML = "<h2>Register</h2>"
}
function loginScreen() {
  document.getElementById("register-form").hidden = true;
  document.getElementById("login-form").hidden = false;
  document.getElementById("login-header").innerHTML = "<h2>Login</h2>"
}
function registerSubmit() {
  var username = document.getElementById("r-username").value;
  var password = document.getElementById("r-password").value;
  var email = document.getElementById("r-email").value;
  $.ajax(
    {
      url: "/register",
      type: "POST",
      data: {
        username: username,
        password: password,
        email: email
      },
      dataType: "json",
      success: function (result) {
        console.log(result);
        loginScreen();
      },
      error: function (e) {
        console.log(e);
      }
    });
}
function loginSubmit() {
  var username = document.getElementById("l-username").value;
  var password = document.getElementById("l-password").value;
  $.ajax(
    {
      url: "/login",
      type: "POST",
      data: {
        username: username,
        password: password,
      },
      dataType: "json",
      success: function (result) {
        console.log(result);
        loggedInUserID = result.user._id
        document.getElementById("navbarDropdown").innerHTML = "User " + result.user.username
        isAdmin(result.user);
        showMainPage(result.user);
      },
      error: function (e) {
        console.log(e);
      }
    });
}
function isAdmin(user) {
  console.log(user);
  if (user.admin) {
    document.getElementById("admin-tag").hidden = false;
    document.getElementById("edit-nav").hidden = false;
  }
}
function showMainPage() {
  clearPage();
  document.getElementById("welcome").hidden = false;
  document.getElementById("login-page").hidden = true;
  document.getElementById("main-page").hidden = false;
}
function showBooksPage() {
  clearPage();
  document.getElementById("books-container").hidden = false;
  loadBooksTable();
}
function showMoviesPage() {
  clearPage();
  document.getElementById("movies-container").hidden = false;
  loadMoviesTable();
}
function loadMoviesTable() {
  $.ajax({
    url: '/getMovies',
    method: 'GET',
    success: function (data) {
      console.log(data);
      $('#movie-table').bootstrapTable("destroy");
      $('#movie-table').bootstrapTable({
        pagination: true,
        search: true,
        data: data, // Assuming the returned data is an array
        columns: [
          { field: 'title', title: 'Title' },
          { field: 'director', title: 'Director' },
          { field: 'genre', title: 'Genre' },
        ]
      });
      if(data.length > 0){
        $('#movie-table tbody tr').append(
          '<td><a href="#" onclick="openModal(this)" class="btn btn-info btn-xs"><i class="fa fa-pencil"></i>Add to List</a></td>'
        );
        $('#movie-table tbody tr').append(
          '<td><a href="#" onclick="showMovieComments(this)" class="btn btn-primary btn-xs"><i class="fa fa-pencil"></i>Show Comments</a></td>'
        );
      }
      
    },
    error: function (error) {
      console.error('Error loading movies:', error);
    }
  });
}
function showMovieComments(element){
  var movieID = element.parentElement.parentElement.id;
  clearPage();
  document.getElementById("comments-page").hidden = false;
  $.ajax({
    url: "/getMovie",
    method: "POST",
    data: {
      movieId: movieID
    },
    success: function (movie) {
      console.log(movie);
      document.getElementById("comments-page-header").innerHTML = "Comments of " + movie.title;
      $("#comment-table").bootstrapTable("destroy");
      $("#comment-table").bootstrapTable({
        pagination: true,
        search: true,
        data: movie.comments, 
        columns: [
          { field: 'commenterName', title: 'Commenter' },
          { field: 'comment', title: 'Comment' },
          { field: 'rating', title: 'Rating' },
        ]
      });
    },
    error: function (e) {
      console.log(e);
    }
  });
}
function loadBooksTable() {
  $.ajax({
    url: '/getBooks',
    method: 'GET',
    success: function (data) {
      console.log(data);
      $('#book-table').bootstrapTable("destroy");
      $('#book-table').bootstrapTable({
        pagination: true,
        search: true,
        data: data, // Assuming the returned data is an array
        columns: [
          { field: 'title', title: 'Title' },
          { field: 'author', title: 'Author' },
          { field: 'genre', title: 'Genre' },
        ],
      });
      $('#book-table tbody tr').append(
        '<td><a href="#" onclick="openModal(this)" class="btn btn-info btn-xs"><i class="fa fa-pencil"></i>Add to List</a></td>'
      );
      $('#book-table tbody tr').append(
        '<td><a href="#" onclick="showBookComments(this)" class="btn btn-primary btn-xs"><i class="fa fa-pencil"></i>Show Comments</a></td>'
      );

    },
    error: function (error) {
      console.error('Error loading books:', error);
    }
  });
}
function showBookComments(element){
  var bookID = element.parentElement.parentElement.id;
  clearPage();
  document.getElementById("comments-page").hidden = false;
  $.ajax({
    url: "/getBook",
    method: "POST",
    data: {
      bookId: bookID
    },
    success: function (book) {
      console.log(book);
      document.getElementById("comments-page-header").innerHTML = "Comments of " + book.title;
      $("#comment-table").bootstrapTable("destroy");
      $("#comment-table").bootstrapTable({
        pagination: true,
        search: true,
        data: book.comments, 
        columns: [
          { field: 'commenterName', title: 'Commenter' },
          { field: 'comment', title: 'Comment' },
          { field: 'rating', title: 'Rating' },
        ]
      });
    },
    error: function (e) {
      console.log(e);
    }
  });
}
function closeModal() {
  $("#rating-modal").modal("hide");
}
function openModal(element) {
  console.log(element.parentNode.parentNode.parentNode.parentNode.id)
  if (element.parentNode.parentNode.parentNode.parentNode.id == "book-table") {
    document.getElementById("save-rating").setAttribute("onclick", "addBookToList('" + element.parentNode.parentNode.id + "')");
  }
  else {
    document.getElementById("save-rating").setAttribute("onclick", "addMovieToList('" + element.parentNode.parentNode.id + "')");
  }
  $("#rating-modal").modal("show");
}
function addMovieToList(movieId) {
  $.ajax(
    {
      url: "/addMovieToList",
      method: "POST",
      data: {
        movieId: movieId,
        userId: loggedInUserID,
        rating: $("#rating-select :selected").text(),
        comment: document.getElementById("comment").value
      },
      success: function (result) {
        console.log(result);
        closeModal();
      },
      error: function (e) {
        console.log(e);
      }
    });
}
function addBookToList(bookId) {
  $.ajax(
    {
      url: "/addBookToList",
      method: "POST",
      data: {
        bookId: bookId,
        userId: loggedInUserID,
        rating: $("#rating-select :selected").text(),
        comment: document.getElementById("comment").value
      },
      success: function (result) {
        console.log(result);
        closeModal();
      },
      error: function (e) {
        console.log(e);
      }
    });
}
function showUserMovies() {
  clearPage();
  document.getElementById("user-movies-container").hidden = false;
  $.ajax(
    {
      url: "/getUserMovieCommentList",
      method: "POST",
      data: {
        userId: loggedInUserID
      },
      success: function (comments) {
        console.log(comments);
        $("#user-movies-table").bootstrapTable("destroy");
        $("#user-movies-table").bootstrapTable({
          pagination: true,
          search: true,
          onClickRow: function (row, $element, field) {
            showCommentsPage(row);
            console.log(row)
          },
          columns: [
            { field: 'title', title: 'Title' },
            { field: 'director', title: 'Director' },
            { field: 'genre', title: 'Genre' },
            { field: 'rating', title: 'Rating' },
            { field: 'comment', title: 'Comment' },
          ]
        });
        for (let i = 0; i < comments.length; i++) {
          var movieId = comments[i].movieId;
          console.log(movieId)
          $.ajax({
            url: "/getMovie",
            method: "POST",
            data: {
              movieId: movieId
            },
            success: function (movie) {
              console.log(movie);
              $(".no-records-found").remove();
              $("#user-movies-table").append(
                '<tr id="' + movie._id + '"><td>' + movie.title + '</td><td>' + movie.director + '</td><td>' + movie.genre + '</td><td>' + comments[i].rating + '</td><td>' + comments[i].comment + '</td></tr>'
              );
              
            },
            error: function (e) {
              console.log(e);
            }
          });
        }
      },
      error: function (e) {
        console.log(e);
      }
    });
}
function showUserBooks() {
  clearPage();
  document.getElementById("user-books-container").hidden = false;
  $.ajax(
    {
      url: "/getUserBookCommentList",
      method: "POST",
      data: {
        userId: loggedInUserID
      },
      success: function (comments) {
        console.log(comments);
        $("#user-books-table").bootstrapTable("destroy");
        $("#user-books-table").bootstrapTable({
          pagination: true,
          search: true,
          onClickRow: function (row, $element, field) {
            showCommentsPage(row);
            console.log(row)
          },
          columns: [
            { field: 'title', title: 'Title' },
            { field: 'author', title: 'Author' },
            { field: 'genre', title: 'Genre' },
            { field: 'rating', title: 'Rating' },
            { field: 'comment', title: 'Comment' },
          ]
        });
        for (let i = 0; i < comments.length; i++) {
          var bookId = comments[i].bookId;
          console.log(bookId)
          $.ajax({
            url: "/getBook",
            method: "POST",
            data: {
              bookId: bookId
            },
            success: function (book) {
              console.log(book);
              $(".no-records-found").remove();
              $("#user-books-table").append(
                '<tr id="' + book._id + '"><td>' + book.title + '</td><td>' + book.author + '</td><td>' + book.genre + '</td><td>' + comments[i].rating + '</td><td>' + comments[i].comment + '</td></tr>'
              );
            },
            error: function (e) {
              console.log(e);
            }
          });
        }
      },
      error: function (e) {
        console.log(e);
      }
    });
}
function showCommentsPage(book) {
  clearPage();
  document.getElementById("books-container").hidden = true;
  document.getElementById("comments-page").hidden = false;
  document.getElementById("comments-page-header").innerHTML = "Comments of " + book.title;
  $("#comment-table").bootstrapTable("destroy")
  $('#comment-table').bootstrapTable({
    pagination: true,
    search: true,
    data: book.comments, // Assuming the returned data is an array
    columns: [
      { field: 'commenterName', title: 'Commenter' },
      { field: 'comment', title: 'Comment' },
      { field: 'rating', title: 'Rating' },
    ]
  });
}
function showEditPage(books) {
  clearPage();
  document.getElementById("edit-page").hidden = false;
  document.getElementById("edit-lists").hidden = false;
  $.ajax({
    url: '/getMovies',
    method: 'GET',
    success: function (data) {
      console.log(data);
      $("#movie-edit-table").bootstrapTable("destroy");
      $('#movie-edit-table').bootstrapTable({
        pagination: true,
        pageSize: 15,
        search: true,
        onClickRow: function (row, $element, field) {
          showEditMoviePage(row);
          console.log(row);
        },
        data: data, // Assuming the returned data is an array
        columns: [
          { field: 'title', title: 'Title' },
          { field: 'director', title: 'Director' },
          { field: 'genre', title: 'Genre' },
        ]
      });
    },
    error: function (error) {
      console.error('Error loading movies:', error);
    }
  });
  $.ajax({
    url: '/getBooks',
    method: 'GET',
    dataType: "json",
    success: function (data) {
      console.log(data);
      $("#book-edit-table").bootstrapTable("destroy");
      $('#book-edit-table').bootstrapTable({
        pagination: true,
        pageSize: 15,
        search: true,
        onClickRow: function (row, $element, field) {
          showEditBookPage(row);
          console.log(row)
        },
        data: data, // Assuming the returned data is an array
        columns: [
          { field: 'title', title: 'Title' },
          { field: 'author', title: 'Author' },
          { field: 'genre', title: 'Genre' },
        ]
      });
    },
    error: function (error) {
      console.error('Error loading books:', error);
    }
  });
}
function addBook() {
  var title = document.getElementById("add-book-title").value;
  var author = document.getElementById("add-book-author").value;
  var genre = document.getElementById("add-book-genre").value;
  $.ajax(
    {
      url: "/addBook",
      type: "POST",
      data: {
        title: title,
        author: author,
        genre: genre
      },
      success: function (result) {
        console.log(result);
        clearPage();
        document.getElementById("edit-page").hidden = false;
        document.getElementById("edit-lists").hidden = false;
        $('#book-edit-table').bootstrapTable("destroy");
        $('#book-edit-table').bootstrapTable({
          pagination: true,
          pageSize: 15,
          search: true,
          onClickRow: function (row, $element, field) {
            showEditBookPage(row);
            console.log(row)
          },
          data: result.books, // Assuming the returned data is an array
          columns: [
            { field: 'title', title: 'Title' },
            { field: 'author', title: 'Author' },
            { field: 'genre', title: 'Genre' },
          ]
        });
      }
    }
  );
}
function addMovie() {
  var title = document.getElementById("add-movie-title").value;
  var director = document.getElementById("add-movie-director").value;
  var genre = document.getElementById("add-movie-genre").value;
  $.ajax(
    {
      url: "/addMovie",
      type: "POST",
      data: {
        title: title,
        director: director,
        genre: genre
      },
      success: function (result) {
        console.log(result);
        clearPage();
        document.getElementById("edit-page").hidden = false;
        document.getElementById("edit-lists").hidden = false;
        $('#movie-edit-table').bootstrapTable("destroy");
        $('#movie-edit-table').bootstrapTable({
          pagination: true,
          pageSize: 15,
          search: true,
          onClickRow: function (row, $element, field) {
            showEditMoviePage(row);
            console.log(row);
          },
          data: result.movies, // Assuming the returned data is an array
          columns: [
            { field: 'title', title: 'Title' },
            { field: 'director', title: 'Director' },
            { field: 'genre', title: 'Genre' },
          ]
        });
      }
    }
  );
}
function saveMovieChanges(){
  var title = document.getElementById("edit-movie-title").value;
  var director = document.getElementById("edit-movie-director").value;
  var genre = document.getElementById("edit-movie-genre").value;
  $.ajax(
    {
      url: "/editMovie",
      type: "POST",
      data: {
        title: title,
        director: director,
        genre: genre,
        id: document.getElementById("edit-movie-title").parentElement.id
      },
      success: function (result) {
        console.log(result);
        clearPage();
        document.getElementById("edit-page").hidden = false;
        document.getElementById("edit-lists").hidden = false;
        $('#movie-edit-table').bootstrapTable("destroy");
        $('#movie-edit-table').bootstrapTable({
          pagination: true,
          pageSize: 15,
          search: true,
          onClickRow: function (row, $element, field) {
            showEditMoviePage(row);
            console.log(row);
          },
          data: result.movies, // Assuming the returned data is an array
          columns: [
            { field: 'title', title: 'Title' },
            { field: 'director', title: 'Director' },
            { field: 'genre', title: 'Genre' },
          ]
        });
      }
    });
}
function saveBookChanges() {
  var title = document.getElementById("edit-book-title").value;
  var author = document.getElementById("edit-book-author").value;
  var genre = document.getElementById("edit-book-genre").value;
  $.ajax(
    {
      url: "/editBook",
      type: "POST",
      data: {
        title: title,
        author: author,
        genre: genre,
        id: document.getElementById("edit-book-title").parentElement.id
      },
      success: function (result) {
        console.log(result);
        clearPage();
        document.getElementById("edit-page").hidden = false;
        document.getElementById("edit-lists").hidden = false;
        document.getElementById("edit-lists")
        $('#book-edit-table').bootstrapTable("destroy");
        $('#book-edit-table').bootstrapTable({
          pagination: true,
          pageSize: 15,
          search: true,
          onClickRow: function (row, $element, field) {
            showEditBookPage(row);
            console.log(row)
          },
          data: result.books, // Assuming the returned data is an array
          columns: [
            { field: 'title', title: 'Title' },
            { field: 'author', title: 'Author' },
            { field: 'genre', title: 'Genre' },
          ]
        });
      }
    });
}

function showAddBookPage() {
  document.getElementById("edit-page").hidden = true;
  document.getElementById("add-book").hidden = false;
}
function showAddMoviePage() {
  document.getElementById("edit-page").hidden = true;
  document.getElementById("add-movie").hidden = false;
}
function showEditMoviePage(row) {
  document.getElementById("edit-lists").hidden = true;
  document.getElementById("edit-movie").hidden = false;

  document.getElementById("edit-movie-title").parentElement.id = row._id;
  document.getElementById("edit-movie-title").value = row.title;
  document.getElementById("edit-movie-director").value = row.director;
  document.getElementById("edit-movie-genre").value = row.genre;
}
function showEditBookPage(row) {
  document.getElementById("edit-lists").hidden = true;
  document.getElementById("edit-book").hidden = false;

  document.getElementById("edit-book-title").parentElement.id = row._id;
  document.getElementById("edit-book-title").value = row.title;
  document.getElementById("edit-book-author").value = row.author;
  document.getElementById("edit-book-genre").value = row.genre;
}
function clearPage() {
  document.getElementById("welcome").hidden = true;
  document.getElementById("books-container").hidden = true;
  document.getElementById("movies-container").hidden = true;
  document.getElementById("comments-page").hidden = true;
  document.getElementById("edit-page").hidden = true;
  document.getElementById("edit-book").hidden = true;
  document.getElementById("edit-movie").hidden = true;
  document.getElementById("edit-lists").hidden = true;
  document.getElementById("add-book").hidden = true;
  document.getElementById("add-movie").hidden = true;
  document.getElementById("user-books-container").hidden = true;
  document.getElementById("user-movies-container").hidden = true;
  // document.getElementById("main-page").hidden = true;
  document.getElementById("login-page").hidden = true;
}

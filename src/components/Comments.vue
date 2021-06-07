<template>
  <div class="row p-2">
    <div class="col-sm-5 col-md-6 col-12 pb-4">
      <div class="comment mt-4 text-justify float-left">
        <img
          src="https://i.imgur.com/yTFUilP.jpg"
          alt=""
          class="rounded-circle"
          width="40"
          height="40"
        />
        <h4>Jhon Doe</h4>
        <span>- 20 October, 2018</span> <br />
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus
          numquam assumenda hic aliquam vero sequi velit molestias doloremque
          molestiae dicta?
        </p>
      </div>
      <div class="text-justify darker mt-4 float-right">
        <img
          src="https://i.imgur.com/CFpa3nK.jpg"
          alt=""
          class="rounded-circle"
          width="40"
          height="40"
        />
        <h4>Rob Simpson</h4>
        <span>- 20 October, 2018</span> <br />
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus
          numquam assumenda hic aliquam vero sequi velit molestias doloremque
          molestiae dicta?
        </p>
      </div>
      <div class="comment mt-4 text-justify">
        <img
          src="https://i.imgur.com/yTFUilP.jpg"
          alt=""
          class="rounded-circle"
          width="40"
          height="40"
        />
        <h4>Jhon Doe</h4>
        <span>- 20 October, 2018</span> <br />
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus
          numquam assumenda hic aliquam vero sequi velit molestias doloremque
          molestiae dicta?
        </p>
      </div>
      <div class="darker mt-4 text-justify">
        <img
          src="https://i.imgur.com/CFpa3nK.jpg"
          alt=""
          class="rounded-circle"
          width="40"
          height="40"
        />
        <h4>Rob Simpson</h4>
        <span>- 20 October, 2018</span> <br />
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus
          numquam assumenda hic aliquam vero sequi velit molestias doloremque
          molestiae dicta?
        </p>
      </div>
    </div>
    <div class="col-lg-4 col-md-5 col-sm-4 offset-md-1 offset-sm-1 col-12 mt-4">
      <form id="algin-form">
        <div class="form-group">
          <h4>Leave a comment</h4>
          <label for="message">Message</label>
          <textarea
            name="msg"
            id=""
            msg
            cols="30"
            rows="5"
            class="form-control"
            style="background-color: black"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" name="name" id="fullname" class="form-control" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" name="email" id="email" class="form-control" />
        </div>

        <div class="form-inline">
          <input type="checkbox" name="check" id="checkbx" class="mr-1" />
          <label for="subscribe"
            >Subscribe me to the newlettter. Are we gonna have a mail list or
            something???</label
          >
        </div>
        <div class="form-group">
          <button type="button" id="post" class="btn">Post Comment</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
@media (min-width: 568px) {
  .end {
    margin-left: auto;
  }
}

@media (max-width: 768px) {
  #post {
    width: 100%;
  }
}

#post {
  margin: 10px;
  padding: 6px;
  padding-top: 2px;
  padding-bottom: 2px;
  text-align: center;
  background-color: #ecb21f;
  border-color: #a88734 #9c7e31 #846a29;
  color: black;
  border-width: 1px;
  border-style: solid;
  border-radius: 13px;
  width: 50%;
}

.comments {
  margin-top: 5%;
  margin-left: 20px;
}

.darker {
  border: 1px solid rgb(87, 105, 224);
  background-color: rgb(39, 50, 122, 0.1) !important;
  float: right;
  border-radius: 5px;
  padding-left: 40px;
  padding-right: 30px;
  padding-top: 10px;
}

.comment {
  border: 1px solid rgb(102, 119, 226);
  background-color: rgb(39, 50, 122);
  float: left;
  border-radius: 5px;
  padding-left: 40px;
  padding-right: 30px;
  padding-top: 10px;
}

.comment h4,
.comment span,
.darker h4,
.darker span {
  display: inline;
}

.comment p,
.comment span,
.darker p,
.darker span {
  color: rgb(184, 183, 183);
}

h1,
h4 {
  color: white;
  font-weight: bold;
}

label {
  color: rgb(212, 208, 208);
}

#align-form {
  margin-top: 20px;
}

.form-group p a {
  color: white;
}

#darker img {
  margin-right: 15px;
  position: static;
}

.form-group input,
.form-group textarea {
  background-color: rgb(39, 50, 122) !important;
  border: 1px solid rgba(16, 46, 46, 1);
  border-radius: 12px;
  color: white;
}

form {
  border: 1px solid rgba(16, 46, 46, 1);
  background-color: rgb(39, 50, 122);
  border-radius: 5px;
  padding: 20px;
}

.row {
  width: 100%;
  background-color: #394173;
  height: 100vh;
  margin: 0;
}
</style>

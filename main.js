



// infinite scroll

let  baseUrl = "https://tarmeezacademy.com/api/v1"
let currentPage = 1
let lastPage = 1

window.addEventListener("scroll",function(){

    const  endOfPage = this.window.innerHeight+ this.window.pageYOffset>=this.document.body.scrollHeight
    console.log(endOfPage)
    console.log(lastPage)

    if(endOfPage && currentPage<lastPage){

        currentPage+=1
        getPosts(false,currentPage)
    }
})
// infinite scroll
setupUi()

getPosts()

toggleLoader(true)

function getPosts(reload=true, page=1){

    const  baseUrl = "https://tarmeezacademy.com/api/v1"

    axios.get(`${baseUrl}/posts?limit=3&page=${page}`)
    .then(response=>{
        toggleLoader(false)



    
        let posts = response.data.data
      lastPage=response.data.meta.last_page
        
        // console.log(posts)
        if(reload){
            document.getElementById("posts").innerHTML=""


        }
        for (const post of posts) {


        let user = getCurrentUser()
        let editPostBtn =""
        let deletepostBtn= ""



            isMyPost = user!= null && post.author.id ==user.id
            if(isMyPost){
                editPostBtn= `  <button class="btn btn-secondary" style="float:right" onclick="editpost('${encodeURIComponent(JSON.stringify(post))}')" data-bs-toggle="modal" data-bs-target="#creat-post-modal">Edit</button>
                `
                deletepostBtn=`<button class="btn btn-danger" style="float:right ;margin-right:5px"  onclick="deletePostBtn('${encodeURIComponent(JSON.stringify(post))}')" data-bs-toggle="modal" data-bs-target="#delete-post-modal">Delete</button>`
            }




            // console.log(post)  
    
            let content = `
            
            <div class="card">
            <div class="card-header">
            <span onclick="userclicked(${post.author.id})"style= "cursor:pointer">
            <img src="${post.author.profile_image
            }" alt="" class="">
            <b>${post.author.username}</b>
            
            </span>
            

             ${editPostBtn}
             ${deletepostBtn}

            </div>
            <div class="card-body" onclick="postClicked(${post.id})">
                <img src="${post.image
                }" alt="">
    
                <h6> ${post.created_at}</h6>
                <h6>${post.title}</h6>
                <p>${post.body}</p>
                <hr>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z"/>
                      </svg> <span>${post.comments_count} Comments  
                      
                      <span id="post-tags-${post.id}"><button class="btn btn-sm rounded-5" style="background-color: gray; color: aliceblue;">policy</button> </span>
    
                      </span>
    
                </div>
    
    
    
            </div>
          </div>
            
            `
            document.getElementById("posts").innerHTML+=content
            const currentPostTagId = `post-tags-${post.id}`
            document.getElementById(currentPostTagId).innerHTML=""
    
            
            for (const tag of post.tags) {
    
                console.log(tag.name)
    
                let tagsContent =`
                
                <button class="btn btn-sm rounded-5" style="background-color: gray; color: aliceblue;">${tag.name}</button>
                
                `
                document.getElementById(currentPostTagId).innerHTML+=tagsContent
                
            }
        }
    }
    
    
    ) 

}




   function   loginButtonClicked(){ 

    let username = document.getElementById("username-input").value
    let password = document.getElementById("username-password").value
toggleLoader(true)
    const params ={
        "username":username,
        "password":password 
    }
    const url = `${baseUrl}/login`
    axios.post(url,params)
    .then(response=>{
        toggleLoader(false)
        console.log(response.data.token)
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        //  const modal = document.getElementById("login-modal")
        //  const myModal= new Bootstrap.Modal(modal)
        //  myModal.hide()
        showAlert("logged in successfully ","success")
        setupUi ()
        getPosts()


    }).catch(error =>{

        console.log(error.response.data.message)
        const message =error.response.data.message
        showAlert(message,"danger")
    })


    console.log(username)
    console.log(password)

}


 

function showAlert(customMessage,type){

    // bootstrap alert 
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
      ].join('')
    
      alertPlaceholder.append(wrapper)
    }
    
        appendAlert(customMessage, type)
        // todo const myAlert = bootstrap.alert.getOrCreatinstance("#success-alert")
        //  todo myAlert.close()

        //todo setTimeout(()=>{

        //     const myAlert = bootstrap.alert.getOrCreatinstance("#success-alert")
        //     myAlert.close()
        // },3000)
}

    function setupUi (){

        const loginButton = document.getElementById("login-btn")
        const logOut =document.getElementById("logout-btn")
        const registerButtoon = document.getElementById("register-btn")
        const token = localStorage.getItem("token")
        const addButton = document.getElementById("add-btn")


        if (token == null){

            if(addButton != null){
                addButton.style.display="none"



            }
            loginButton.style.visibility="visible"

            logOut.style.display="none"
            registerButtoon.style.visibility="visible"
            document.getElementById("nav-username").innerHTML=""
            document.getElementById("user-img").style.display="none"




        }else{

            if(addButton != null){

                addButton.style.display="block"

            }

            registerButtoon.style.visibility="hidden"
            logOut.style.visibility="visible"
            loginButton.style.visibility="hidden"
            logOut.style.setProperty("background-color","red","important")
            const user = getCurrentUser()
            document.getElementById("nav-username").innerHTML=user.username
                document.getElementById("user-img").src =user.profile_image


          






        }
        getPosts()
    } 
      function logOut(){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setupUi ()
        showAlert("logged out successfully ","danger")



     }
 
     function registerButtonClicked(){

const registername = document.getElementById("register-name-input").value
const registerusername= document.getElementById("register-username-input").value
const registerpassowrd= document.getElementById("register-username-password").value
const userImage = document.getElementById("register-image-input").files[0]


let  formData = new FormData()
formData.append("name",registername)
formData.append("username",registerusername)
formData.append("password",registerpassowrd)
formData.append("image",userImage)


// replaced by form data to can add user photo

// const param ={

//     "name":registername,
//     "username":registerusername,
//     "password":registerpassowrd
// }


toggleLoader(true)

const url = `${baseUrl}/register`

const headers ={
    "Content-type":"multipart/form-data"
}

axios.post(url,formData,{
    headers:headers
})
.then(response=>{
    toggleLoader(false)

    console.log(response)
    console.log(response.data.token)
    localStorage.setItem("token",response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))

    //todo  const modal=document.getElementById("register-modal")
    //todo const modalinstance = bootstrap.modal.getInstance(modal)
    //todo modalinstance.hide()
        showAlert("registered successfully ","success")
    setupUi ()
}).catch(error =>{
 
    console.log(error.response.data.message)
    const message =error.response.data.message
    showAlert(message,"danger")


})




     }




     function creatNewPostClick(){

        let postId = document.getElementById("post-id-input").value
        let isCreat = postId== null || postId=="" 
        

     const title=document.getElementById("creat-post-title-input").value
     const body=document.getElementById("post-text-area").value
     const image = document.getElementById("post-image-input").files[0]
    

     let formingData = new FormData()
     formingData.append("body",body)
     formingData.append("title",title)
     formingData.append("image",image)

     const params = {
        "title" : title,
        "body":body

    
    }
    let url = ""

   
    const token= localStorage.getItem("token")

    const headers = {
        "authorization":`Bearer ${token}`,
        "Content-Type" :"multipart/form-data"
    }


toggleLoader(true)

    if(isCreat){
        url=`${baseUrl}/posts`
        axios.post(url,formingData,{
            
            headers:headers
           }
    
    
        ).then(response =>{
            toggleLoader(false)

    
            showAlert("new post has been posted ", "success")
    
            console.log(response)
    
            getPosts()
            
    
        }).catch(error=>{
    
            const message= error.response.data.message
            showAlert(message,"danger")
    
        })
    }else{

        formingData.append("_method","put")
        url=`${baseUrl}/posts/${postId }`
        axios.post(url,formingData,{
            
            headers:headers
           }
    
    
        ).then(response =>{
    
    
            showAlert("new post has been posted ", "success")
    
            console.log(response)
    
            getPosts()
            
    
        }).catch(error=>{
    
            const message= error.response.data.message
            showAlert(message,"danger")
    
        })

    }
    //    axios.post(url,formingData,{
            
    //     headers:headers
    //    }


    // ).then(response =>{


    //     showAlert("new post has been posted ", "success")

    //     console.log(response)

    //     getPosts()
        

    // }).catch(error=>{

    //     const message= error.response.data.message
    //     showAlert(message,"danger")

    // })

    


        }


        function getCurrentUser (){

            let user = null
            const storageUser = localStorage.getItem("user")
            if(storageUser !== null){
            user=JSON.parse(storageUser)
        }
        return user

        }

        getPosts()


        function postClicked(postid){

            // alert(postid)
            window.location=`postDetails.html?postid=${postid}`

        }



function editpost(postObject) {

    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)
    
    document.getElementById("post-id-input").value=post.id
    document.getElementById("exampleModalLabel").innerHTML="edit post "
    document.getElementById("creat-post-title-input").value=post.title
    document.getElementById("post-text-area").value=post.body
    document.getElementById("post-btn-submit").innerHTML="Update"
    //todo let editModal = new bootstrab.modal(document.getElementById("creat-post-modal"),{})
    //todo  editModal.toggle()

}   
        
function addBtnClick() {


    document.getElementById("post-id-input").value=""
    document.getElementById("exampleModalLabel").innerHTML="Creat new Post  "
    document.getElementById("creat-post-title-input").value=""
    document.getElementById("post-text-area").value=""
    document.getElementById("post-btn-submit").innerHTML="Creat" 

}

function deletePostBtn(postObject){


    let post = JSON.parse(decodeURIComponent(postObject))

    document.getElementById("delete-post-input").value = post.id
}

function confirmPostDelete(){

let   postid=    document.getElementById("delete-post-input").value  
let token= localStorage.getItem("token")
const headers = {
    "authorization":`Bearer ${token}`,
    "Content-Type" :"multipart/form-data"
}

    const url = `${baseUrl}/posts/${postid} `
    axios.delete(url,{
        headers:headers
    })
    .then(response =>{
        console.log(response)

    }).catch(error =>{

        console.log(error)
        const message = error.response.data.message
        showAlert("the post has been Deleted","danger")
        getPosts()
    })
  
}

function getCurrentUserId (){


    console.log(window.location.search)
    const urlparams = new URLSearchParams(window.location.search)
    console.log(urlparams)
   const id =  urlparams.get("userid")
   return id
}

function userclicked(userid){
    window.location =`profile.html?userid=${userid}`
    alert(userid)
}



function profileclicked(){


  const user =   getCurrentUser()
  let userid =user.id
  window.location =`profile.html?userid=${userid}`


}

// loaders
function toggleLoader(show=true){
if(show){
    document.getElementById("loader").style.visibility="visible"
}else{
    document.getElementById("loader").style.visibility="hidden"

}
}

toggleLoader()
// loaders
 

       


// setupUi()
let  baseUrl = "https://tarmeezacademy.com/api/v1"

getCurrentUser ()


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
function getCurrentUser (){

    let user = null
    const storageUser = localStorage.getItem("user")
    if(storageUser !== null){
    user=JSON.parse(storageUser)
}
return user

}


function getCurrentUserId (){


    console.log(window.location.search)
    const urlparams = new URLSearchParams(window.location.search)
    console.log(urlparams)
   const id =  urlparams.get("userid")
   return id
}
function getUser (){
    const id =  getCurrentUserId ()
    axios.get(`${baseUrl}/users/${id}`)
.then(response=>{

    // console.log(response)
    const user = response.data.data
    document.getElementById("main-info-email").innerHTML=user.email
    document.getElementById("header-image").src=user.profile_image
    document.getElementById("main-info-name").innerHTML=user.name
    document.getElementsByClassName("username")[0].innerHTML=user.name
    document.getElementById("main-info-username").innerHTML=user.username
    document.getElementById("posts-count").innerHTML=user.posts_count
    document.getElementById("comments-count").innerHTML=user.comments_count

})

}

getUser ()
getPosts()

function getPosts(){

    const  baseUrl = "https://tarmeezacademy.com/api/v1"
    const id =  getCurrentUserId ()

    axios.get(`${baseUrl}/users/${id}/posts`)
    .then(response=>{

        // console.log(response)
    




    
        let posts = response.data.data
        document.getElementById("user-post").innerHTML=""
        
        // console.log(posts)
     
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
             <img src="${post.author.profile_image
             }" alt="" class="">
             <b>${post.author.username}</b>

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
            document.getElementById("user-post").innerHTML+=content
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




function deletePostBtn(postObject){


    let post = JSON.parse(decodeURIComponent(postObject))

    document.getElementById("delete-post-input").value = post.id
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




if(isCreat){
    url=`${baseUrl}/posts`
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

    function profileclicked(){


        const user =   getCurrentUser()
        let userid =user.id
        window.location =`profile.html?userid=${userid}`
      
      
      }
       
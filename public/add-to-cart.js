let addtocart=document.querySelectorAll('#add-to-cart')


function updateCart(dish){
  // console.log('hello');
  // console.log(dish);
  
  fetch("http://localhost:3000/update-cart",{
    method: 'POST',
    body: JSON.stringify(dish), 
    
  })

  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err))

}
 



addtocart.forEach((btn)=>{
  btn.addEventListener('click',(e)=>{
    let dish=JSON.parse(btn.dataset.dish)
    // console.log(dish);
    updateCart(dish);
  })
})
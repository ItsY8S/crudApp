const deleteButton = document.querySelector('#deleteButton')
const users = document.querySelector('#users')
const apikey =
  'ec8972b23e307b45b0f47bcdf678155caf306bfe075174393a67c1b8c25e59ac'
const endpoint = `https://randomuser.me/api/?results=8`
let content = ''

const promise = new Promise(function(resolve, reject) {
  getPeople(endpoint, resolve)
})

function buildHTML(results, resolve) {
  console.log(results)

  content += `<article id="newUser">
      <img src="images/placeholder.png" alt="Picture"/>
      <button class="addButton">+</button>
      <ul class="noMargin">
        <input type="text" name="name" id="name" placeholder="Name" required />
        <input type="text" name="address" id="address" placeholder="Address" required />
        <input type="email" name="email" id="email" placeholder="Email" required />
      </ul>
    </article>`

  results.forEach(result => {
    content += `<article class="results">
          <img src="${result.picture.large}"  alt="${result.name.first} ${
      result.name.last
    } Picture"/>
          <button class="deleteButton">X</button>
          <ul>
            <li>${result.name.first} ${result.name.last}</li>
            <li>${result.location.street}, ${result.location.city}, ${
      result.location.state
    }  ${result.location.postcode}</li>
            <li>${result.email}</li>
          </ul>
        </article>`
  })

  users.innerHTML = content

  localStorage.setItem('listItems', $('#users').html())
  resolve()
}

function getPeople(endpoint, resolve) {
  let listItems = []

  document.querySelector('#users').innerHTML = localStorage.getItem('listItems')

  localStorage.setItem('listItems', document.querySelector('#users').innerHTML)

  fetch(endpoint)
    .then(response => {
      if (response.ok) {
        return response.json()
        console.log(response.json())
      } else {
        return Promise.reject('Error!')
      }
    })
    .then(results => buildHTML(results.results, resolve))
    .catch(error => console.log('Error is', error))
}

promise.then(() => {
  const image = document.querySelector('#image')
  const name = document.querySelector('#name')
  const address = document.querySelector('#address')
  const email = document.querySelector('#email')
  const addButton = document.querySelector('#addButton')

  const formData = {
    image: null,
    name: null,
    address: null,
    email: null
  }

  name.addEventListener('keyup', () => {
    formData.name = name.value
  })

  address.addEventListener('keyup', () => {
    formData.address = address.value
  })

  email.addEventListener('keyup', () => {
    formData.email = email.value
  })

  $('.addButton').click(() => {
    console.log('clicked')
    console.log(name.value)
    if (name.value !== '' && address !== '' && email !== '') {
      fetch(endpoint)
        .then(response => response.json())
        .then(results => {
          const result = results.results[0]

          $(`<article class="results">
               <img src="${result.picture.large}" alt="Picture"/>
               <button class="deleteButton">X</button>
               <ul>
                 <li>${formData.name}</li>
                 <li>${formData.address}</li>
                 <li>${formData.email}</li>
               </ul>
             </article>
             `).insertAfter('#newUser')
          console.log('dom', name)
          name.value = ''
          address.value = ''
          email.value = ''

          localStorage.setItem(
            'listItems',
            document.querySelector('#users').innerHTML
          )
        })
        .catch(error => console.log('Error is', error))
    } else {
      $('.noMargin input').addClass('error')
    }
  })
})

$(document).on('click', '.deleteButton', function() {
  $(this)
    .parent()
    .remove()
  localStorage.setItem('listItems', $('#users').html())
})

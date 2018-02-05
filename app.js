/* ConsutalCEP - http://consultacep.cf
 * https://github.com/wgenial/consultacep
 * Developed by WGenial - http://wgenial.com.br
 */

// Variables
const $zipcode = document.querySelector('#zipcode');
const $output = document.querySelector('#output');
const msg = {
  "zipcode_invalid": "O CEP informado é inválido.",
  "zipcode_notfound": "O CEP informado não existe!",
  "zipcode_error": "Ocorreu um erro ao realizar a consulta do CEP, tente novamente.",
};

// Apply mask
VMasker($zipcode).maskPattern("99999-999");

// Listener for form search
document.querySelector('#search').addEventListener('submit', getZipcode);

// Listen for button close output
document.querySelector("body").addEventListener("click", closeOutput);


// Get Zipcode
function getZipcode(event) {
  event.preventDefault();

  loading('on');

  if (!zipcodeValidation($zipcode.value)) {
    loading('off');
    $output.innerHTML = `
      <article class="message is-danger">
        <div class="message-header">
          <p>CEP: <strong>${$zipcode.value}</strong></p>
          <button class="delete" aria-label="delete"></button>
        </div>
        <div class="message-body">${msg.zipcode_invalid}</div>
      </article>
    `;
    $zipcode.focus();
    throw Error(msg.zipcode_invalid);
  }


  // Request zipcode using fetch API
  fetch(`https://viacep.com.br/ws/${$zipcode.value}/json/`)
  .then(response => {

    loading('off');

    if (response.status != 200) {
      $output.innerHTML = `
        <article class="message is-danger">
          <div class="message-header">
            <p>CEP: <strong>${$zipcode.value}</strong></p>
            <button class="delete" aria-label="delete"></button>
          </div>
          <div class="message-body">${msg.zipcode_error}</div>
        </article>
      `;
      $zipcode.focus();
      throw Error(response.status);
    }
    else {
      return response.json();
    }
  })
  .then(data => {
    loading('off');

    if (data.erro) {
      $output.innerHTML = `
      <article class="message is-warning">
        <div class="message-header">
          <p>CEP: <strong>${$zipcode.value}</strong></p>
          <button class="delete" aria-label="delete"></button>
        </div>
        <div class="message-body">${msg.zipcode_notfound}</div>
      </article>
      `;
      $zipcode.focus();
    }
    else {
      $output.innerHTML = `
        <article class="message">
          <div class="message-header">
            <p>CEP: <strong>${$zipcode.value}</strong></p>
            <button class="delete"></button>
          </div>
          <div class="message-body">
            <ul>
              <li><strong>Endereço: </strong>${data.logradouro}</li>
              <li><strong>Complemento: </strong>${data.complemento}</li>
              <li><strong>Bairro: </strong>${data.bairro}</li>
              <li><strong>Cidade: </strong>${data.localidade}</li>
              <li><strong>Estado: </strong>${data.uf}</li>
            </ul>
          </div>
        </article>
      `;
    }
  })
  .catch(err => console.warn(err));
}

// Zipcode validation
function zipcodeValidation(value) {
  return /(^[0-9]{5}-[0-9]{3}$|^[0-9]{8}$)/.test(value) ? true : false;
}

// Close Output Container
function closeOutput(event) {
  if (event.target.className == 'delete') {
    $output.innerHTML = '';
    $zipcode.value = '';
    $zipcode.focus();
  }
}

// Loading
function loading(status) {
  let is_invisible = (status == 'on') ? '' : 'is-invisible';
  $output.innerHTML = `
    <div class="has-text-centered">
      <span class="button is-white is-size-2 is-loading ${is_invisible}"></span>
    </div>
  `;
}

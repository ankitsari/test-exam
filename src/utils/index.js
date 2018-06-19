//const getURL = url => `http://createsession.azurewebsites.net/api${url ? url : ''}`
const getURL = url => `https://techview.azurewebsites.net/api${url ? url : ''}`

const getCookie = (name) => {

  const nameEQ = `${name}=`
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i += 1) {

    let c = ca[i]
    while (c.charAt(0) === ' ') {

      c = c.substring(1, c.length)

    }
    if (c.indexOf(nameEQ) === 0) {

      return c.substring(nameEQ.length, c.length)

    }

  }
  return null

}

const setCookie = (name, value, days) => {

  let expires
  if (days) {

    const date = new Date()
    date.setTime(date.getTime() + ( days * 24 * 60 * 60 * 1000 ))
    expires = `; expires=${date.toGMTString()}`

  } else {

    expires = ''

  }
  document.cookie = `${name}=${value}${expires}; path=/`

}

const eraseCookie = (names) => {

  names.forEach(name => setCookie(name, '', -1))


}

const isJSON = (json) => {

  try {

    if (JSON.parse(json)) {

      return true

    }

    return true

  } catch (err) {

    return false

  }

}

const utils = {
  getURL,
  getCookie,
  setCookie,
  eraseCookie,
  isJSON,
}

export default utils

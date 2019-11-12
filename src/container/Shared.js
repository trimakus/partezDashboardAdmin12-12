
const  destroyToken = function (){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('me');
    window.location.replace('/signin');
}

/**********************************************************************************************************************/
const getToken = function () {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const me = localStorage.getItem('me');

    if (!token || !expiration || !me) {
        return null;
    }
    if (Date.now() > parseInt(expiration)) {
        destroyToken()
        return null;
    }
    return token;
}
/**********************************************************************************************************************/
const storeToken= function(token,expiration,user)
{
    localStorage.setItem('expiration', expiration);
    localStorage.setItem('token',token);
    localStorage.setItem('me', JSON.stringify(user));
}
/**********************************************************************************************************************/
const getCurrentUser= function()
{
    if(getToken()!== null)
        return  localStorage.getItem('me');
    else
        return null

}
/**********************************************************************************************************************/
const updateCurrentUser= function(user)
{
    localStorage.removeItem('me');
    localStorage.setItem('me', JSON.stringify(user));
}
/**********************************************************************************************************************/

export {
    destroyToken,
    getToken,
    storeToken,
    getCurrentUser,
    updateCurrentUser
};



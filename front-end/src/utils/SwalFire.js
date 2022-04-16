import Swal from 'sweetalert2';

function getParams(config, text, titleDefault, textDefault){
    var title = "";

    if(typeof config === 'string'){
        if(text){
            title = config;
        }else{
            text = config;
        }
    }else{
        title = config.hasOwnProperty('title') ? config.title : titleDefault;
        text = config.hasOwnProperty('text') ? config.text : textDefault;
        
        if(config.hasOwnProperty('error') && config.error){
           switch(config.error){
               case 'email-already-in-use':
                     title = 'The mail is already in use';
                        text = 'Please, try another email';
                    break;
                case 'firebase/invalid-email':
                    title = 'Invalid email';
                    text = 'The entered mail is not valid';
                    break;
                case 'auth/user-not-found':
                    title = 'User not found';
                    text = 'The user entered does not exist';
                    break;
                case 'auth/wrong-password':
                    title = 'Incorrect password';
                    text = 'The password entered is not correct';
                    break;
                    case 'auth/user-disabled':
                    title = 'User disabled';
                    text = 'The user entered is disabled';
                    break;
                case 'auth/weak-password':
                    title = 'Debil password';
                    text = 'The password entered is too weak. Enter a better password';
                    break;
           }
        }
    }

    return {title, text};
}


export const SwalFireConfirmDelete = (config = {}, text_ = "") => {
    var {title, text} = getParams(config, text_, 'Are you sure?', "You can not reverse this!");
    
    return Swal.fire({
        title,
        text,
        icon              : 'warning',
        showCancelButton  : true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor : '#d33',
        confirmButtonText : 'Yes, delete it!'
    })
};



export const SwalFireError = (config = {}, text_ = "") => {  
    var {title, text} = getParams(config, text_, '¡oh, no!', 'An unexpected error has occurred, please recharge the page and try again.');

    Swal.fire({
        title,
        text,
        icon              : 'error',
        confirmButtonColor: '#3085d6',
    })
};

export const SwalFireSuccess = (config = {}, text_ = "") => {
    var {title, text} = getParams(config, text_, 'Great!', 'Done');

    Swal.fire({
        title,
        text,
        icon              : 'success',
        confirmButtonColor: '#3085d6',
    })
};

export const SwalFireConfirm = (config = {}, text_ = "") => {
    var {title, text} = getParams(config, text_, 'Are you sure?', "You can not reverse this!");

    return Swal.fire({
        title,
        text,
        icon              : 'question',
        showCancelButton  : true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor : '#d33',
        confirmButtonText : config.confirmButtonText || 'Yes continue!',
        cancelButtonText  : config.cancelButtonText || 'Cancel'
    })
}
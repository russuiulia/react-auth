import { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';
const ProfileForm = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const newPasswordInputRef = useRef();
  const url = 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAYIucbDRcprv5KbEB1w1pntAqBordh840'

  const submitHandler = event => {
    event.preventDefault();
    const enteredNewPassword = newPasswordInputRef.current.value;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application / json'
      },
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false
      })
    }).then(res => {
      history.replace('/');
    })
  }
  return (

    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;

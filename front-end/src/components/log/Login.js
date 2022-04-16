import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import defaultConfigUseForm from '../../utils/defaultConfigUseForm';

import TemplateLog from './Template';

import requestsUsers from "../../API/requestsUsers";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Modal } from 'react-bootstrap';

import CustomButton from '../common/Button';
import { Button } from '@mui/material';

import { SwalFireError, SwalFireSuccess } from '../../utils/SwalFire';
import { Input, InputSection } from './common';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showModalResetPassword, setShowModalResetPassword] = useState(false);

    const { register, handleSubmit } = useForm(defaultConfigUseForm);

    let navigate = useNavigate();

    async function onSubmitFormLoginUser(data) {
        setLoading(true);

        requestsUsers.signIn(data).then(({ error }) => {
            if (error) {
                SwalFireError({ error });
            } else {
                navigate("../");
            }

            setLoading(false);
        }).catch(error => {
            SwalFireError({ error });
            setLoading(false);
        });
    };

    function onSubmitFormEmailResetPassword(data) {

        requestsUsers.resetPassword(data.email).then(res => {
            if (res.error) {
                SwalFireError(res.error);
            } else {
                SwalFireSuccess("Mail sent"," Please, remember to confirm also in your spam tray");
                setShowModalResetPassword(false);
            }
        }).catch(error => console.error(error));
    }

    return (
        <>
            <TemplateLog title="Iniciar Sesión" handleSubmit={handleSubmit} onSubmit={onSubmitFormLoginUser}>

                <InputSection elements={[
                    <Input type="email" autoComplete="email" label="Email" name="email" register={register} />
                ]} />

                <InputSection lastWidthAuto elements={[
                    <Input type={showPassword ? "text" : "password"} autoComplete="current-password" label="Password" name="password" register={register} />,

                    <button className="btn btn-light" type="button" onClick={() => setShowPassword(!showPassword)}>
                        <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />
                    </button>
                ]} />

                <InputSection>
                    <CustomButton submit loading={loading} >Entrar</CustomButton>
                </InputSection>

                <p className='pointer text-center mt-3' onClick={() => setShowModalResetPassword(true)}>Did you forget your password?</p>

                <InputSection>
                    <Link className="text-decoration-none d-grid" to="../register">
                        <Button variant="text">Do not you have an account yet? Sign up!</Button>
                    </Link>
                </InputSection>

            </TemplateLog>






            <Modal size="md" centered show={showModalResetPassword} onHide={() => setShowModalResetPassword(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Restore password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className='d-grid' onSubmit={handleSubmit(onSubmitFormEmailResetPassword)}>
                        <div className='container p-md-5 d-grid'>
                            <p className='text-center title h5'>Write the email of your account</p>

                            <div className="form-group my-4">
                                <input type="email" className="form-control" placeholder="Email" autoComplete='email' {...register("email", { required: true, maxLength: 200 })} />
                            </div>

                            <button type="submit" className="btn btn-primary mt-3">Send confirmation mail</button>
                        </div>
                    </form>

                </Modal.Body>
            </Modal>

        </>
    )
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";
import defaultConfigUseForm from '../../utils/defaultConfigUseForm';

import requestsUsers from "../../API/requestsUsers";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import CustomButton from '../common/Button';

import TemplateLog from "./Template";
import { Input, InputSection } from "./common.js";

import { SwalFireError, SwalFireSuccess } from '../../utils/SwalFire';

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, watch } = useForm(defaultConfigUseForm);
    const [showPassword, setShowPassword] = useState(false);

    let navigate = useNavigate();

    function onSubmitFormRegisterUser(data) {
        setIsLoading(true);
        requestsUsers.create(data).then(({ error, data }) => {
            setIsLoading(false);
            
            if (error) {
                SwalFireError({ error });
            } else {
                SwalFireSuccess("Successful registration", "You already have access to the platform");
                navigate("../");
            }
        }).catch(error => {
            SwalFireError({ error });
            setIsLoading(false);
        });
    };

    return (
        <TemplateLog title="Create User Account" handleSubmit={handleSubmit} onSubmit={onSubmitFormRegisterUser}>
            <InputSection elements={[
                <Input label="Name" name="name" register={register} autoComplete="name" />,
                <Input label="Lastname" name="lastname" register={register} autoComplete="lastname" />
            ]} />

            <InputSection elements={[
                <Input label="Email" name="email" type="email" register={register} autoComplete="email" />
            ]} />

            <InputSection lastWidthAuto elements={[
                <Input label="Password" name="password" type={showPassword ? "text" : "password"} register={register} minLength={6} autoComplete="new-password" />,

                <Input label="Repeat password" name="confirmPwd" type={showPassword ? "text" : "password"} autoComplete="new-password" register={register} validate={(val) => {
                    if (watch('password') != val) {
                        return "Las contraseñas no coinciden";
                    }else if(val.length < 6){
                        return "La contraseña es demasiado corto, debe tener al menos 6 caracteres";
                    }
                }} />,

                <button type="button" className="btn btn-light" onClick={e => setShowPassword(!showPassword)}>
                    <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />
                </button>
            ]} />

            <InputSection>
                <CustomButton submit loading={isLoading} >Register</CustomButton>
            </InputSection>

            <InputSection>
                <Link className="text-decoration-none d-grid" to="../login">
                    <Button variant="text">Do you already have a user account? Log in</Button>
                </Link>
            </InputSection>
        </TemplateLog>
    )
}

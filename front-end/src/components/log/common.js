import { TextField } from '@mui/material';

export function Input ({ register, name, label, type, optional, validate, minLength, maxLength, ...rest }) {
    let registerConfig = {
        required: optional ? false : true,
        maxLength: maxLength || 200,
        minLength: minLength || 1
    }; 
 
    if (validate) {
        registerConfig.validate = validate;
    }
  
    return (
        <TextField
            {...register(name, registerConfig)}
            label={label}
            type={type || "text"}
            variant="outlined"
            fullWidth
            size="small"
            {...rest}
        />
    );
};

export function InputSection ({ elements, lastWidthAuto, children }) {
    return (
        <div className="row mt-4">
            {
                elements
                    ? elements.map((element, index) => (
                        <div className={`pe-0 ${(lastWidthAuto && ((index + 1) == elements.length)) ? "col-auto" : "col"}`} key={index}>
                            {element}
                        </div>
                    ))
                    : (
                        <div className="col d-grid">
                            {children}
                        </div>
                    )
            }
        </div>
    );
};
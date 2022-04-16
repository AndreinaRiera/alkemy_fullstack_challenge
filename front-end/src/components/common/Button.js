import { Spinner } from 'react-bootstrap';

export default function Button({ variant, loading, onClick, children, submit }) {
    return (
        <button type={submit ? 'submit' : `button`} className={`btn btn-${variant || 'primary'}`} onClick={onClick} disabled={loading}>
            {
                loading
                    ? <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    : children
            }
        </button>
    )
}

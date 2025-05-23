import { useRef, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import "./PostPage.css";
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../../api/auth.API';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

const PostPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user._id) {
            alert("Por favor, inicia sesión para crear un post");
            navigate('/auth/login');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user._id) {
            alert("Por favor, inicia sesión para crear un post");
            return;
        }

        const newPost = {
            title,
            description,
            image
        };

        console.log('Enviando datos al backend:', newPost);

        try {
            const response = await axios.post(`${BASE_URL}/api/posts`, newPost, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Respuesta del servidor:', response.data);
            setTitle('');
            setDescription('');
            setImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Error completo:", error);
            console.error("Respuesta del servidor:", error.response?.data);
            alert("Error al crear el post: " + (error.response?.data?.message || error.message));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    return (
        <div className="post-page">
            <h1>Comparte tu Post!!</h1>
            
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Título</Form.Label>
                    <Form.Control 
                        type="text"
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3}
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control 
                        type="file" 
                        onChange={handleImageChange} 
                        accept="image/*"
                        ref={fileInputRef}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Subir
                </Button>
                <Button variant="secondary" type="button" onClick={handleCancel}>
                    Cancelar
                </Button>
            </Form>
        </div>
    );
};

export default PostPage;

import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CardHomePage from '../../components/Card/CardHomePage';
import axios from 'axios';
import { BASE_URL } from '../../../api/auth.API';
import "./HomePage.css";

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/posts`);
            setPosts(response.data); // Quitamos el .reverse() ya que el backend ya los envía ordenados
        } catch (error) {
            console.error("Error fetching posts", error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (currentPost) {
            try {
                const updatedPost = { title, description, image };
                await axios.put(`${BASE_URL}/api/posts/${currentPost._id}`, updatedPost);
                fetchPosts(); // Refresh the posts list
                setIsEditing(false);
                setCurrentPost(null);
                setTitle('');
                setDescription('');
                setImage(null);
            } catch (error) {
                console.error("Error updating post", error);
            }
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


    return (
        <div className="home-page">
            <h1>Inicio</h1>
            <div className='Content-Home'>
                <div className="Aside-Left">
                    <h3>Nosotros</h3>
                    <p>
                        En ECOTREE, nuestra misión es conectar a las personas a través de experiencias compartidas, creando una comunidad inclusiva, abierta y llena de inspiración. Nuestra plataforma permite que cada persona, sin importar su origen o ubicación, tenga un espacio para expresar su voz, compartir sus vivencias y aprender de los demás.
                    </p>
                    
                </div>

                <div className='Main'>
                    {isEditing && currentPost ? (
                        <Form onSubmit={handleEditSubmit}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Title</Form.Label>
                                <Form.Control 
                                    type="text"
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Description</Form.Label>
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
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Save
                            </Button>
                            <Button variant="secondary" type="button" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </Form>
                        ) : (
                        <div className="posts-list">
                            {posts.map((post) => (
                                <div key={post._id} className="post-item">
                                    <CardHomePage
                                        imageSrc={post.image}
                                        title={post.title}
                                        text={post.description}
                                        name={post.user ? post.user.name : 'Usuario Anónimo'}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="Aside-Right">
                    <h3>Contáctanos</h3>
                    <p>Email: ecotree@gmail.com</p>
                    <p>Móvil: +123 456 789</p>
                    <h4>Síguenos</h4>
                    <ul>
                        <li><a href="#facebook">Facebook</a></li>
                        <li><a href="#twitter">Twitter</a></li>
                        <li><a href="#instagram">Instagram</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

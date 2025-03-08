import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CardMyAccount from '../../components/CardMyAccount/CardMyAccount';
import CardMyProfile from '../../components/CardMyProfile/CardMyProfile';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "./MyAccountPage.css";

const MyAccountPage = () => {
    const { user } = useSelector((state) => state.auth);

    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    
    const fetchPostsByUser = useCallback(async () => {
        if (!user?._id) return; // Evitar errores si user es null o undefined
        try {
            const response = await axios.get(`http://localhost:5000/users/user/${user._id}`);
            console.log("Fetched posts:", response.data.posts); // <-- Verifica que estás obteniendo los posts
            setPosts(response.data.posts.reverse()); // Invierte el orden de los posts
        } catch (error) {
            console.error("Error fetching user posts", error);
        }
    }, [user?._id]);
        

    useEffect(() => {
        console.log('User:', user); 
        fetchPostsByUser();
    }, [fetchPostsByUser]);
    
    const deletePost = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`);
            setPosts(posts.filter(post => post._id !== id));
        } catch (error) {
            console.error("Error deleting post", error);
        }
    };

    const editPost = (post) => {
        setIsEditing(true);
        setCurrentPost(post);
        setTitle(post.title);
        setDescription(post.description);
        setImage(post.image);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (currentPost) {
            try {
                const updatedPost = { title, description, image };
                await axios.put(`http://localhost:5000/api/posts/${currentPost._id}`, updatedPost);
                fetchPostsByUser(); // Refresh the posts list
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
            <h1>Mi Cuenta</h1>
            <div className='Content'>
                <div className='data'>
                    <CardMyProfile
                        userImg={user.userImage}
                        name={user.name}
                        email={user.email}
                        age={user.age}
                        country={user.country}
                    />
                </div>
                <div className='posts'>
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
                        <ul className="posts-list">
                            {posts.map(post => (
                                <CardMyAccount
                                    key={post._id}
                                    imageSrc={post.image}
                                    title={post.title}
                                    text={post.description}
                                    name={post.userName}
                                    editPost={() => editPost(post)}
                                    deletePost={() => deletePost(post._id)}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            
            
            
        </div>
    );
};

export default MyAccountPage;

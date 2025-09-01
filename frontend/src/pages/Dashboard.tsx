import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  Spinner,
  Alert,
  Row,
  Col,
  Badge,
  Container,
  Modal,
  Image,
  Button,
} from 'react-bootstrap';
import { getToken } from '../utils/storage';

interface PurchasedCourse {
  id: string;
  user: {
    name: string;
    username: string;
    telegramId: string;
  };
  course: {
    title: string;
    price: number;
  };
  checkImage: string;
  status: string;
}

const PurchasedCourses: React.FC = () => {
  const [courses, setCourses] = useState<PurchasedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = getToken();
        const res = await axios.get('https://digital-talim-bot.onrender.com/purchased-courses/pending', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(res.data.data);
      } catch (err) {
        setError("Ma'lumotlarni olishda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleStatusUpdate = async (id: string, newStatus: 'verified' | 'unverified') => {
    try {
      console.log(id);
      
      const token = getToken();
      await axios.patch(
        `https://digital-talim-bot.onrender.com/purchased-courses/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },        }
      );

      // Local holatda ham statusni yangilash
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === id ? { ...course, status: newStatus } : course
        )
      );
    } catch (err) {
      alert("Statusni yangilashda xatolik yuz berdi.");
    }
  };

  if (loading) return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <Row className="g-4">
        {courses.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100 shadow-sm border-0 d-flex flex-column justify-content-between">
              <div
                style={{ height: '280px', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => handleImageClick(item.checkImage)}
              >
                <Card.Img
                  variant="top"
                  src={`https://digital-talim-bot.onrender.com/image/${item.checkImage}`}
                  alt="Check image"
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
              <Card.Body style={{ padding: '0.75rem' }}>
                <Card.Title style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                  {item.course.title}
                </Card.Title>
                <Card.Text style={{ fontSize: '0.85rem' }}>
                  <strong>Narx:</strong> {item.course.price.toLocaleString()} so'm <br />
                  <strong>Ism:</strong> {item.user.name} <br />
                  <strong>@{item.user.username}</strong> <br />
                  <small className="text-muted">TG ID: {item.user.telegramId}</small>
                </Card.Text>
                <Badge
                  bg={
                    item.status === 'pending'
                      ? 'warning'
                      : item.status === 'verified'
                      ? 'success'
                      : 'secondary'
                  }
                  className="text-dark"
                >
                  {item.status}
                </Badge>

                {/* Action buttons */}
                <div className="d-flex justify-content-between mt-2">
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleStatusUpdate(item.id, 'verified')}
                    disabled={item.status === 'verified'}
                  >
                    ✔ Tasdiqlash
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleStatusUpdate(item.id, 'unverified')}
                    disabled={item.status === 'unverified'}
                  >
                    ✖ Bekor qilish
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Image Preview */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>To‘lov tasdig‘i rasmi</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedImage && (
            <Image
              src={`https://digital-talim-bot.onrender.com/image/${selectedImage}`}
              alt="Full check image"
              fluid
              rounded
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PurchasedCourses;

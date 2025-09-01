import React, { useState } from "react";

interface Course {
  _id: string;
  title: string;
  image: string;
  price: number;
  telegram_username: string;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="card h-100 shadow-sm">
        <img
          src={course.image}
          alt={course.title}
          className="card-img-top"
          style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
          onClick={() => setShowModal(true)}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{course.title}</h5>
          <p className="card-text">
            Narxi: <strong>{course.price.toLocaleString()} so'm</strong>
          </p>
          <p className="card-text text-muted">Telegram: @{course.telegram_username}</p>
        </div>
      </div>

      {showModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          onClick={() => setShowModal(false)}
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-body text-center">
                <img
                  src={course.image}
                  alt={course.title}
                  className="img-fluid"
                  style={{ maxHeight: "80vh", objectFit: "contain" }}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseCard;

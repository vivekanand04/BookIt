import { Experience } from '../types';
import { useNavigate } from 'react-router-dom';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const navigate = useNavigate();

  return (
    <div className="card hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={experience.image_url}
          alt={experience.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{experience.title}</h3>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {experience.location}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {experience.description}
        </p>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">From </span>
            <span className="text-lg font-bold text-gray-900">₹{experience.price}</span>
          </div>
          <button
            onClick={() => navigate(`/experience/${experience.id}`)}
            className="btn-primary text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}


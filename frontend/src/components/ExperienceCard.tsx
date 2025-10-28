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
      <div className="relative h-40 overflow-hidden">
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
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
            {experience.location}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {experience.description}
        </p>

        <div className="flex items-center">
          <div>
            <span className="text-sm text-gray-500">From </span>
            <span className="text-lg font-bold text-gray-900">₹{experience.price}</span>
          </div>
          <button
            onClick={() => navigate(`/experience/${experience.id}`)}
            className="bg-primary hover:bg-primary-dark text-black font-medium px-3 py-2 rounded transition-colors text-sm ml-auto"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import ExperienceCard from '../components/ExperienceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Experience } from '../types';
import { experienceApi } from '../services/api';

export default function Home() {
  const [searchParams] = useSearchParams();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchExperiences(searchParams.get('search') || '');
  }, [searchParams]);

  const fetchExperiences = async (search: string) => {
    try {
      setLoading(true);
      const data = await experienceApi.getAll(search);
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        showSearch={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : experiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No experiences found</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,280px))] justify-center gap-6">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


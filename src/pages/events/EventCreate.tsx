import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Calendar, 
  MapPin, 
  Users,
  Image,
  Plus,
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useEventStore } from '../../stores/eventStore';
import { useUIStore } from '../../stores/uiStore';

export const EventCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createEvent, loading } = useEventStore();
  const { pushToast } = useUIStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    venue: {
      name: '',
      address: '',
      capacity: 0,
    },
    startAt: '',
    endAt: '',
    categoryId: 'music',
    tags: [] as string[],
    images: [] as string[],
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: child === 'capacity' ? parseInt(value) || 0 : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const eventData = {
        ...formData,
        startAt: new Date(formData.startAt),
        endAt: new Date(formData.endAt),
        status: publish ? 'published' : 'draft',
        companyId: 'company1', // Mock company ID
        pricing: {
          currency: 'USD' as const,
          dynamicPricingEnabled: false,
        },
        tickets: [],
      };

      const newEvent = await createEvent(eventData);
      pushToast({ 
        type: 'success', 
        message: `Event ${publish ? 'published' : 'saved as draft'} successfully!` 
      });
      navigate(`/events/${newEvent.id}`);
    } catch (error: any) {
      pushToast({ type: 'error', message: error.message || 'Failed to create event' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, name: 'Basic Info', icon: '📝', fields: ['title', 'description', 'shortDescription'] },
    { id: 2, name: 'Venue & Time', icon: '📍', fields: ['venue', 'startAt', 'endAt'] },
    { id: 3, name: 'Details', icon: '🏷️', fields: ['categoryId', 'tags', 'images'] },
  ];

  const isStepValid = (stepId: number) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return false;

    return step.fields.every(field => {
      if (field === 'venue') {
        return formData.venue.name && formData.venue.address && formData.venue.capacity > 0;
      }
      if (field === 'tags' || field === 'images') {
        return true; // Optional fields
      }
      return formData[field as keyof typeof formData];
    });
  };

  // Mobile progress steps with better UX
  const MobileProgress = () => (
    <div className="lg:hidden mb-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Step {currentStep} of {steps.length}
        </span>
        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          {steps[currentStep - 1].name}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link 
              to="/events" 
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Create New Event
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
                Fill in the details to create your event
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button 
              variant="outline" 
              leftIcon={<Eye className="w-4 h-4" />}
              responsive
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Preview</span>
            </Button>
            <Button 
              onClick={(e) => handleSubmit(e, false)}
              loading={loading === 'loading' && !isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
              responsive
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Save Draft</span>
              <span className="sm:hidden">Save</span>
            </Button>
          </div>
        </div>

        <MobileProgress />

        {/* Progress Steps - Desktop */}
        <div className="hidden lg:flex items-center justify-center space-x-4 md:space-x-8 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center space-x-3 transition-colors ${
                  currentStep >= step.id 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  currentStep > step.id 
                    ? 'bg-indigo-600 text-white' 
                    : currentStep === step.id
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 ring-2 ring-indigo-500 ring-offset-2'
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <span className="font-medium hidden md:block">{step.name}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 md:mx-4 ${
                  currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg p-2 mr-3">
                          📝
                        </span>
                        Basic Information
                      </h2>
                      
                      <Input
                        label="Event Title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter event title"
                        required
                        className="text-base"
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Short Description
                        </label>
                        <textarea
                          name="shortDescription"
                          value={formData.shortDescription}
                          onChange={handleInputChange}
                          placeholder="Brief description for listings and cards"
                          rows={3}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-3 text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Detailed event description with all the information attendees need to know"
                          rows={6}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-3 text-sm"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg p-2 mr-3">
                          📍
                        </span>
                        Venue & Schedule
                      </h2>
                      
                      <Input
                        label="Venue Name"
                        name="venue.name"
                        value={formData.venue.name}
                        onChange={handleInputChange}
                        leftIcon={<MapPin className="w-4 h-4" />}
                        placeholder="Enter venue name"
                        required
                      />

                      <Input
                        label="Venue Address"
                        name="venue.address"
                        value={formData.venue.address}
                        onChange={handleInputChange}
                        placeholder="Enter full address"
                        required
                      />

                      <Input
                        label="Capacity"
                        type="number"
                        name="venue.capacity"
                        value={formData.venue.capacity}
                        onChange={handleInputChange}
                        leftIcon={<Users className="w-4 h-4" />}
                        placeholder="Maximum number of attendees"
                        min="1"
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Start Date & Time"
                          type="datetime-local"
                          name="startAt"
                          value={formData.startAt}
                          onChange={handleInputChange}
                          leftIcon={<Calendar className="w-4 h-4" />}
                          required
                        />

                        <Input
                          label="End Date & Time"
                          type="datetime-local"
                          name="endAt"
                          value={formData.endAt}
                          onChange={handleInputChange}
                          leftIcon={<Calendar className="w-4 h-4" />}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg p-2 mr-3">
                          🏷️
                        </span>
                        Additional Details
                      </h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-3 text-sm"
                        >
                          <option value="music">🎵 Music</option>
                          <option value="conference">💼 Conference</option>
                          <option value="sports">⚽ Sports</option>
                          <option value="arts">🎨 Arts & Culture</option>
                          <option value="food">🍔 Food & Drink</option>
                          <option value="other">🔮 Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tags
                        </label>
                        <div className="flex items-center space-x-2 mb-3">
                          <input
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            placeholder="Add a tag and press Enter"
                            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5 text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          />
                          <Button 
                            type="button" 
                            onClick={addTag} 
                            size="sm"
                            className="h-full"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 rounded-full"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          {formData.tags.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                              Add tags to help people discover your event
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Event Images
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer">
                          <div className="space-y-3 text-center">
                            <Image className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex flex-col sm:flex-row text-sm text-gray-600 dark:text-gray-400">
                              <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                                <span>Upload images</span>
                                <input type="file" className="sr-only" multiple accept="image/*" />
                              </label>
                              <p className="sm:pl-1 mt-1 sm:mt-0">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                  responsive
                >
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                    disabled={!isStepValid(currentStep)}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Next
                  </Button>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      onClick={(e) => handleSubmit(e, false)}
                      variant="outline"
                      loading={isSubmitting}
                      responsive
                    >
                      Save Draft
                    </Button>
                    <Button
                      type="button"
                      onClick={(e) => handleSubmit(e, true)}
                      loading={isSubmitting}
                    >
                      Publish Event
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Card className="bg-gray-50 dark:bg-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Event Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                      <Image className="w-10 h-10 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        No image
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">
                        {formData.title || 'Your Event Title'}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {formData.shortDescription || 'Short description will appear here'}
                      </p>

                      {formData.venue.name && (
                        <div className="flex items-start space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{formData.venue.name}</span>
                        </div>
                      )}

                      {formData.startAt && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{new Date(formData.startAt).toLocaleDateString()}</span>
                          <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded-full">
                            {new Date(formData.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}

                      {formData.tags.length > 0 && (
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex flex-wrap gap-1">
                            {formData.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                            {formData.tags.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300 rounded-md">
                                +{formData.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
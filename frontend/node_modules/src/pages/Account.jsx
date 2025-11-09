// src/pages/Account.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Save, X, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '../context/UserContext';
import { DIET_OPTIONS, ALLERGEN_OPTIONS, HEALTH_FOCUS_OPTIONS, GENDER_OPTIONS } from '../lib/constants';

const Account = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: user?.gender || '',
    age: user?.age || '',
    dietPreference: user?.dietPreference || '',
    allergens: user?.allergens || [],
    healthFocus: user?.healthFocus || [],
    height: user?.height || '',
    weight: user?.weight || ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      gender: user?.gender || '',
      age: user?.age || '',
      dietPreference: user?.dietPreference || '',
      allergens: user?.allergens || [],
      healthFocus: user?.healthFocus || [],
      height: user?.height || '',
      weight: user?.weight || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please login to view your account</h2>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-6 border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.name || 'User'}</h1>
                  <p className="text-gray-600">Manage your personal information</p>
                </div>
              </div>
              
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <Edit2 className="w-5 h-5 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                {isEditing ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-12"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.name || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Age</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="h-12"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.age || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              {isEditing ? (
                <div className="grid grid-cols-3 gap-3">
                  {GENDER_OPTIONS.map(gender => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender })}
                      className={`py-3 rounded-xl font-medium transition-all ${
                        formData.gender === gender
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-900 font-medium">{user.gender || 'Not set'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dietary Preferences */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Dietary Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Diet Type</Label>
              {isEditing ? (
                <div className="grid grid-cols-3 gap-3">
                  {DIET_OPTIONS.map(diet => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => setFormData({ ...formData, dietPreference: diet })}
                      className={`py-3 rounded-xl font-medium transition-all ${
                        formData.dietPreference === diet
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-900 font-medium">{user.dietPreference || 'Not set'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Allergens</Label>
              {isEditing ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ALLERGEN_OPTIONS.map(allergen => (
                    <button
                      key={allergen}
                      type="button"
                      onClick={() => handleArrayToggle('allergens', allergen)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        formData.allergens.includes(allergen)
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {allergen}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.allergens?.length > 0 ? (
                    user.allergens.map((allergen, index) => (
                      <Badge key={index} variant="destructive">{allergen}</Badge>
                    ))
                  ) : (
                    <p className="text-gray-600">None selected</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Health & Fitness */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Health & Fitness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Health Focus</Label>
              {isEditing ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {HEALTH_FOCUS_OPTIONS.map(focus => (
                    <button
                      key={focus}
                      type="button"
                      onClick={() => handleArrayToggle('healthFocus', focus)}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${
                        formData.healthFocus.includes(focus)
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {focus}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.healthFocus?.length > 0 ? (
                    user.healthFocus.map((focus, index) => (
                      <Badge key={index} className="bg-blue-600">{focus}</Badge>
                    ))
                  ) : (
                    <p className="text-gray-600">None selected</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Height (cm)</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="h-12"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.height ? `${user.height} cm` : 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="h-12"
                    step="0.1"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.weight ? `${user.weight} kg` : 'Not set'}</p>
                )}
              </div>
            </div>

            {user.height && user.weight && !isEditing && (
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Body Mass Index (BMI)</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {(user.weight / Math.pow(user.height / 100, 2)).toFixed(1)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 h-12"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
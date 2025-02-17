import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Save } from 'lucide-react';

const AttributeField = ({ label, value, type = "text", onChange, isEditing }) => {
  const displayValue = value || '';
  
  if (Array.isArray(displayValue)) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {isEditing ? (
          <Textarea 
            value={displayValue.join('\n')}
            onChange={(e) => onChange(e.target.value.split('\n').filter(Boolean))}
            className="w-full min-h-24"
          />
        ) : (
          <div className="space-y-1">
            {displayValue.map((item, index) => (
              <div key={index} className="text-gray-600 dark:text-gray-400">
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {isEditing ? (
        type === "textarea" ? (
          <Textarea 
            value={displayValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-24"
          />
        ) : (
          <Input 
            type={type}
            value={displayValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        )
      ) : (
        <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
          {displayValue}
        </div>
      )}
    </div>
  );
};

const TribeDetailModal = ({ tribe }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTribe, setEditedTribe] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (tribe) {
      setEditedTribe(tribe);
    }
  }, [tribe]);

  if (!editedTribe) {
    return null;
  }

  const handleAttributeChange = (attributeName, value) => {
    setEditedTribe(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attributeName]: {
          ...prev.attributes[attributeName],
          attribute_value: {
            value: value
          }
        }
      }
    }));
  };

  const getAttributeValue = (key) => {
    return editedTribe?.attributes?.[key]?.attribute_value?.value ?? '';
  };

  const basicAttributes = {
    "tribe-About": "About",
    "tribe-History": "History",
    "tribe-PopulationInNumbers": "Population",
    "tribe-Language": "Language"
  };

  const culturalAttributes = {
    "tribe-TraditionalDresses": "Traditional Dresses",
    "tribe-Arts&Crafts": "Arts & Crafts",
    "tribe-TraditionalCuisine": "Traditional Cuisine"
  };

  const locationAttributes = {
    "tribe-Regions": "Regions",
    "tribe-Settlements": "Settlements"
  };

  const renderAttributeSection = (attributes) => (
    <div className="space-y-6">
      {Object.entries(attributes).map(([key, label]) => (
        <AttributeField
          key={key}
          label={label}
          value={getAttributeValue(key)}
          type={key.includes("About") || key.includes("History") ? "textarea" : "text"}
          onChange={(value) => handleAttributeChange(key, value)}
          isEditing={isEditing}
        />
      ))}
    </div>
  );

  const handleSave = async () => {
    // Will implement PATCH request here
    console.log('Saving:', editedTribe);
    setIsEditing(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {editedTribe.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditedTribe(tribe);
                      setIsEditing(false);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Tribe
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="cultural">Cultural Details</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6 space-y-6">
            {renderAttributeSection(basicAttributes)}
          </TabsContent>

          <TabsContent value="cultural" className="mt-6 space-y-6">
            {renderAttributeSection(culturalAttributes)}
          </TabsContent>

          <TabsContent value="location" className="mt-6 space-y-6">
            {renderAttributeSection(locationAttributes)}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TribeDetailModal;
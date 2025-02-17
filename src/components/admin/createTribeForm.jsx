"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import RenderAttributes from "../Attributes";

export default function CreateTribeForm({ setShowAddTribe }) {
  const [attributes, setAttributes] = useState([]);
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTribeName, setNewTribeName] = useState("");
  const [attributeValues, setAttributeValues] = useState({});
  const [error, setError] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [thumbnailImage, setThumbnailImage] = useState(null);

  useEffect(() => {
    fetchAttributes();
    fetchAttributeTypes();
  }, []);

  const fetchAttributeTypes = async () => {
    try {
      const response = await fetch("/api/attributeTypes");
      const data = await response.json();
      setAttributeTypes(data.data);
    } catch (error) {
      console.error("Error fetching attribute types:", error);
      setAttributeTypes([]);
    }
  };

  const fetchAttributes = async () => {
    try {
      const response = await fetch("/api/tribe/attributes");
      const data = await response.json();
      if (data.success) {
        setAttributes(data.data);
      }
    } catch (error) {
      console.error("Error fetching attributes:", error);
    }
  };

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleCreateTribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const attributeArray = Object.entries(attributeValues)
        .filter(([id, value]) => value)
        .map(([id, value]) => {
          const attribute = attributes.find((attr) => attr.id.toString() === id);
          return {
            attribute_id: parseInt(id),
            attribute_name: attribute.name,
            attribute_type_id: attribute.attribute_type_id,
            attribute_value: value,
          };
        });

      const response = await fetch("/api/tribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTribeName,
          attributes: attributeArray,
          user_id: 1,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewTribeName("");
        setAttributeValues({});
        if (setShowAddTribe) setShowAddTribe(false);
      } else {
        setError(data.error || "Failed to create tribe");
      }
    } catch (error) {
      setError("Error creating tribe: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Tribe</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleCreateTribe} className="space-y-4">
            <div>
              <Label>Tribe Name</Label>
              <Input
                type="text"
                value={newTribeName}
                onChange={(e) => setNewTribeName(e.target.value)}
                required
              />
            </div>

            {/* <div>
              <Label>Banner Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setBannerImage)} />
              {bannerImage && <img src={bannerImage} alt="Banner Preview" className="mt-2 max-h-32 w-full object-contain" />}
            </div>

            <div>
              <Label>Thumbnail Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setThumbnailImage)} />
              {thumbnailImage && <img src={thumbnailImage} alt="Thumbnail Preview" className="mt-2 h-20 w-20 object-cover" />}
            </div> */}

            {attributes.map((attr) => (
              <div key={attr.id} className="space-y-2">
                <div className="text-sm text-gray-500">{attr.description}</div>
                <RenderAttributes
                  attribute={attr}
                  attributeValues={attributeValues}
                  setAttributeValues={setAttributeValues}
                  attributeTypes={attributeTypes}
                />
              </div>
            ))}

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Tribe"}
              </Button>
              <Button variant="outline" onClick={() => setShowAddTribe(false)}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

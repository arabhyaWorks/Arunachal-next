"use client";


import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RenderAttributes from "../components/Attributes";

const TribeManagement = () => {
  // Core data states
  const [tribes, setTribes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create");

  // Form states
  const [newTribeName, setNewTribeName] = useState("");
  const [attributeValues, setAttributeValues] = useState({});
  const [error, setError] = useState("");

  // New attribute form states
  const [newAttribute, setNewAttribute] = useState({
    name: "",
    description: "",
    is_required: false,
    attribute_type_id: "",
  });

  useEffect(() => {
    fetchTribes();
    fetchAttributes();
    fetchAttributeTypes();
  }, []);

  const fetchAttributeTypes = async () => {
    try {
      const response = await fetch("/api/attributeTypes");
      const data = await response.json();
      // Direct array response without .data wrapper
      setAttributeTypes(data.data);
    } catch (error) {
      console.error("Error fetching attribute types:", error);
      setAttributeTypes([]);
    }
  };

  const fetchTribes = async () => {
    try {
      const response = await fetch("/api/tribe");
      const data = await response.json();
      if (data.success) {
        setTribes(data.data);
      }
    } catch (error) {
      console.error("Error fetching tribes:", error);
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

  const getAttributeTypeId = (attributeId) => {
    const attribute = attributes.find((attr) => attr.id === attributeId);
    return attribute.attribute_type_id;
  };

  const handleStructureChange = (id, value) => {
    if ([8, 9, 10].includes(getAttributeTypeId(id))) {
      return value.value;
    }
    return value;
  };

  const validateRequiredAttributes = () => {
    const requiredAttributes = attributes.filter((attr) => attr.is_required);
    const missingRequired = requiredAttributes.filter(
      (attr) => !attributeValues[attr.id] || !attributeValues[attr.id].trim()
    );

    if (missingRequired.length > 0) {
      setError(
        `Missing required attributes: ${missingRequired
          .map((attr) => attr.name)
          .join(", ")}`
      );
      return false;
    }
    return true;
  };

  const handleCreateTribe = async (e) => {
    e.preventDefault();
    // if (!validateRequiredAttributes()) return;

    setLoading(true);
    setError("");

    try {
      console.log(attributeValues);
      console.log(attributes);
      const attributeArray = Object.entries(attributeValues)
        .filter(([id, value]) => value) // Only include attributes with values
        .map(([id, value]) => {
          const attribute = attributes.find(
            (attr) => attr.id.toString() === id
          );

          // console.log(value);

          return {
            attribute_id: parseInt(id),
            attribute_name: attribute.name,
            attribute_value: handleStructureChange(parseInt(id), value),
          };
        });

      console.log({
        name: newTribeName,
        attributes: attributeArray,
        user_id: 1
      });

      

      const response = await fetch('/api/tribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTribeName,
          attributes: attributeArray,
          user_id: 1
        })
      });

      const data = await response.json();
      if (data.success) {
        setNewTribeName('');
        setAttributeValues({});
        fetchTribes();
        setError('');
      } else {
        setError(data.error || 'Failed to create tribe');
      }
    } catch (error) {
      setError("Error creating tribe: " + error.message);
    }
    setLoading(false);
  };

  const formatAttributeName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  };

  const handleCreateAttribute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Format the attribute name
      const formattedName = formatAttributeName(newAttribute.name);
      const attributeName = formattedName.startsWith("tribe-")
        ? formattedName
        : `tribe-${formattedName}`;

      const response = await fetch("/api/tribe/attributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attributes: [
            {
              name: attributeName,
              description: newAttribute.description,
              is_required: newAttribute.is_required,
              attribute_type_id: parseInt(newAttribute.attribute_type_id),
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewAttribute({
          name: "",
          description: "",
          is_required: false,
          attribute_type_id: "",
        });
        fetchAttributes();
        setError("");
      } else {
        setError(data.error || "Failed to create attribute");
      }
    } catch (error) {
      setError("Error creating attribute: " + error.message);
    }
    setLoading(false);
  };

  const ShowAttributeData = ({ attribute }) => {
    console.log(attribute);

    return (
      <div>
        <Label>{attribute.attribute_description}</Label>
        {
          [8,9,10].includes(attribute.attribute_type_id) ? (
            <div>
              {JSON.stringify(attribute.attribute_value)}
            </div>
          ):(
            <div>
              {/* {JSON.stringify(attribute.attribute_value.value.value)} */}
              {
                attribute.attribute_value.value
              }
              {attribute.attribute_type_id}
            </div>
          )
        }
      </div>
    );
  };

  return (
    <div className="p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tribe Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="create">Create Tribe</TabsTrigger>
              <TabsTrigger value="attributes">Manage Attributes</TabsTrigger>
              <TabsTrigger value="view">View Tribes</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="create">
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

                {attributes.map((attr) => (
                  <div key={attr.id} className="space-y-2">
                    {/* <Label>
                      {attr.name} {attr.is_required && <span className="text-red-500">*</span>}
                    </Label> */}
                    <div className="text-sm text-gray-500">
                      {attr.description}
                    </div>
                    {/* {renderAttributeInput(attr)} */}
                    <RenderAttributes
                      attribute={attr}
                      attributeValues={attributeValues}
                      setAttributeValues={setAttributeValues}
                      attributeTypes={attributeTypes}
                    />
                  </div>
                ))}

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Create Tribe"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="attributes">
              <form onSubmit={handleCreateAttribute} className="space-y-4">
                <div>
                  <Label>Attribute Name</Label>
                  <Input
                    type="text"
                    value={newAttribute.name}
                    onChange={(e) =>
                      setNewAttribute((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                    placeholder="e.g., History of Tribe (will be prefixed with 'tribe-')"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    type="text"
                    value={newAttribute.description}
                    onChange={(e) =>
                      setNewAttribute((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Description of what this attribute represents"
                  />
                </div>

                <div>
                  <Label>Attribute Type</Label>
                  <Select
                    value={newAttribute.attribute_type_id}
                    onValueChange={(value) =>
                      setNewAttribute((prev) => ({
                        ...prev,
                        attribute_type_id: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select attribute type" />
                    </SelectTrigger>
                    <SelectContent>
                      {attributeTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name} - {type.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="required"
                    checked={newAttribute.is_required}
                    onCheckedChange={(checked) =>
                      setNewAttribute((prev) => ({
                        ...prev,
                        is_required: checked,
                      }))
                    }
                  />
                  <Label htmlFor="required">Required Attribute</Label>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Create Attribute"
                  )}
                </Button>
              </form>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">
                  Existing Attributes
                </h3>
                <div className="space-y-4">
                  {attributes.map((attr) => {
                    const type = attributeTypes.find(
                      (t) => t.id === attr.attribute_type_id
                    );
                    return (
                      <div key={attr.id} className="p-4 border rounded">
                        <div className="font-medium">{attr.name}</div>
                        <div className="text-sm text-gray-600">
                          {attr.description}
                        </div>
                        <div className="text-sm mt-1">
                          <span className="font-medium">Type:</span>{" "}
                          {type?.name || "Unknown"}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Required:</span>{" "}
                          {attr.is_required ? "Yes" : "No"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="view">
              <div className="space-y-6">
                {tribes.map((tribe) => (
                  <div key={tribe.tribe_id} className="p-4 border rounded">
                    <h3 className="text-xl font-medium mb-2">{tribe.name}</h3>
                    <div className="space-y-2">
                      {tribe.attributes.map((attr, idx) => (
                        <div key={idx} className="text-sm">
                          {/* <span className="font-medium">{attr.attribute_name}: </span> */}
                          {/* <span>
                            {typeof attr.attribute_value.value === 'object' 
                              ? JSON.stringify(attr.attribute_value.value)
                              : attr.attribute_value.value.toString()}
                              {
                                JSON.stringify(attr.attribute_value)
                              }

                          </span> */}

                          <ShowAttributeData attribute={attr} />
                          {}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TribeManagement;

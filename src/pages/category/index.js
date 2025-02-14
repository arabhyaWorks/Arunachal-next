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
import RenderAttributes from "../../components/attributes/index";

// A simple component to display attribute data (for the view tab)
const ShowAttributeData = ({ attribute }) => {
  return (
    <div>
      <Label>{attribute.attribute_description}</Label>
      {[8, 9, 10].includes(attribute.attribute_type_id) ? (
        <div>{JSON.stringify(attribute.attribute_value)}</div>
      ) : (
        <div>{attribute.attribute_value.value}</div>
      )}
    </div>
  );
};

const CategoryManagement = () => {
  // Core data states
  const [categories, setCategories] = useState([]);
  const [categoryAttributes, setCategoryAttributes] = useState([]);
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create");

  // Form states for creating category
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  // Form states for creating a new attribute for a category
  const [selectedCategoryForAttr, setSelectedCategoryForAttr] = useState("");
  const [newAttribute, setNewAttribute] = useState({
    name: "",
    description: "",
    is_required: false,
    attribute_type_id: "",
  });

  // Form states for creating a category item
  const [selectedCategoryForItem, setSelectedCategoryForItem] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  // const [itemAttributeValues, setItemAttributeValues] = useState({});
  const [attributeValues, setAttributeValues] = useState({});

  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchAttributeTypes();
    if (selectedCategoryForAttr) {
      fetchCategoryAttributes(selectedCategoryForAttr);
    }
  }, [selectedCategoryForAttr]);

  // Fetch the list of categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch attribute types (for attribute creation)
  const fetchAttributeTypes = async () => {
    try {
      const response = await fetch("/api/attributeTypes");
      const data = await response.json();
      setAttributeTypes(data.data);
    } catch (error) {
      console.error("Error fetching attribute types:", error);
    }
  };

  // Fetch attributes for a specific category
  const fetchCategoryAttributes = async (categoryId) => {
    try {
      const response = await fetch(
        `/api/category/attributes?category_id=${categoryId}`
      );
      const data = await response.json();
      if (data.success) {
        setCategoryAttributes(data.data);
      }
    } catch (error) {
      console.error("Error fetching category attributes:", error);
    }
  };

  // Create a new category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDescription,
          user_id: 1, // Replace with dynamic user ID as needed
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNewCategoryName("");
        setNewCategoryDescription("");
        fetchCategories();
      } else {
        setError(data.error || "Failed to create category");
      }
    } catch (error) {
      setError("Error creating category: " + error.message);
    }
    setLoading(false);
  };

  // Utility: format attribute name (capitalize words)
  const formatAttributeName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  };

  // Create a new attribute for a selected category
  const handleCreateCategoryAttribute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
    
      const response = await fetch("/api/category/attributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: selectedCategoryForAttr,
          category_name:
            categories.find(
              (cat) => cat.id.toString() === selectedCategoryForAttr
            )?.name || "",
          attribute_name: newAttribute.name,
          description: newAttribute.description,
          attribute_type_id: parseInt(newAttribute.attribute_type_id),
          is_required: newAttribute.is_required,
          user_id: 1,
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
        fetchCategoryAttributes(selectedCategoryForAttr);
      } else {
        setError(data.error || "Failed to create attribute");
      }
    } catch (error) {
      setError("Error creating attribute: " + error.message);
    }
    setLoading(false);
  };

  const getAttributeTypeId = (attributeId) => {
    const attribute = categoryAttributes.find((attr) => attr.id === attributeId);
    return attribute.attribute_type_id;
  };

  const handleStructureChange = (id, value) => {
    if ([8, 9, 10].includes(getAttributeTypeId(id))) {
      return value.value;
    }
    return value;
  };

  // Create a new category item for a selected category
  const handleCreateCategoryItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log(attributeValues, categoryAttributes);

    const attributeArray = Object.entries(attributeValues)
      .filter(([id, value]) => value) // Only include attributes with values
      .map(([id, value]) => {
        const attribute = categoryAttributes.find((attr) => attr.id.toString() === id);

        console.log(value);

        return {
          attribute_id: parseInt(id),
          attribute_name: attribute.name,
          attribute_type_id: getAttributeTypeId(parseInt(id)),
          attribute_value: handleStructureChange(parseInt(id), value),
        };
      });

      console.log({
        category_id: selectedCategoryForItem,
        name: newItemName,
        description: newItemDescription,
        user_id: 1,
        attributes: attributeArray,
      });
    try {
      console.log("Creating item");
      const response = await fetch("/api/category/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: selectedCategoryForItem,
          name: newItemName,
          description: newItemDescription,
          user_id: 1,
          attributes: attributeArray,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNewItemName("");
        setNewItemDescription("");
        setAttributeValues({});
      } else {
        setError(data.error || "Failed to create category item");
        console.log(data.error);
      }
    } catch (error) {
      setError("Error creating category item: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="create">Create Category</TabsTrigger>
              <TabsTrigger value="attributes">Manage Attributes</TabsTrigger>
              <TabsTrigger value="item">Create Category Item</TabsTrigger>
              <TabsTrigger value="view">View Categories</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Create Category Tab */}
            <TabsContent value="create">
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <Label>Category Name</Label>
                  <Input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    type="text"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Create Category"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Manage Attributes Tab */}
            <TabsContent value="attributes">
              <div className="space-y-4">
                <div>
                  <Label>Select Category</Label>
                  <Select
                    value={selectedCategoryForAttr}
                    onValueChange={(value) => setSelectedCategoryForAttr(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <form
                  onSubmit={handleCreateCategoryAttribute}
                  className="space-y-4"
                >
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
                      placeholder="e.g., Videos"
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
                      placeholder="Description of this attribute"
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
                    Existing Attributes for Selected Category
                  </h3>
                  <div className="space-y-4">
                    {categoryAttributes.map((attr) => {
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
              </div>
            </TabsContent>

            {/* Create Category Item Tab */}
            <TabsContent value="item">
              <div className="space-y-4">
                <div>
                  <Label>Select Category</Label>
                  <Select
                    value={selectedCategoryForItem}
                    onValueChange={(value) => {
                      setSelectedCategoryForItem(value);
                      fetchCategoryAttributes(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <form onSubmit={handleCreateCategoryItem} className="space-y-4">
                  <div>
                    <Label>Item Name</Label>
                    <Input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      type="text"
                      value={newItemDescription}
                      onChange={(e) => setNewItemDescription(e.target.value)}
                    />
                  </div>
                  {selectedCategoryForItem && categoryAttributes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Attributes</h3>
                      {categoryAttributes.map((attr) => (
                        <div key={attr.id} className="space-y-2">
                          <div className="text-sm text-gray-500">
                            {attr.description}
                          </div>
                          <RenderAttributes
                            attribute={attr}
                            attributeValues={attributeValues}
                            setAttributeValues={setAttributeValues}
                            attributeTypes={attributeTypes}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Create Category Item"
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>

            {/* View Categories Tab */}
            <TabsContent value="view">
              <div className="space-y-6">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 border rounded">
                    <h3 className="text-xl font-medium mb-2">{cat.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {cat.description}
                    </p>
                    {/* Optionally, you could list attributes for the category here */}
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

export default CategoryManagement;

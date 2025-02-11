import React, { useState, useEffect, version } from "react";
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

export const VideoInput = ({ value = [], setValue }) => {
  const addNewVideo = () => {
    setValue([
      ...value,
      {
        title: "",
        file_path: "",
        mime_type: "",
        description: "",
        thumbnail_path: "",
        created_by: 1,
      },
    ]);
  };

  const updateVideo = (index, field, newValue) => {
    const newData = [...value];
    newData[index][field] = newValue;
    newData[index].updated_at = new Date().toISOString();
    setValue(newData);
  };

  const removeVideo = (index) => {
    const newData = [...value];
    newData.splice(index, 1);
    setValue(newData);
  };

  return (
    <div className="space-y-4">
      {value.map((video, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Video Entry {index + 1}</h4>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeVideo(index)}
            >
              Remove
            </Button>
          </div>

          <div className="grid gap-3">
            <div>
              <Label>Title</Label>
              <Input
                value={video.title}
                onChange={(e) => updateVideo(index, "title", e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={video.description}
                onChange={(e) =>
                  updateVideo(index, "description", e.target.value)
                }
                placeholder="Enter description"
              />
            </div>

            <div>
              <Label>File Path</Label>
              <Input
                value={video.file_path}
                onChange={(e) =>
                  updateVideo(index, "file_path", e.target.value)
                }
                placeholder="Enter file path"
              />
            </div>

            <div>
              <Label>Thumbnail Path</Label>
              <Input
                value={video.thumbnail_path}
                onChange={(e) =>
                  updateVideo(index, "thumbnail_path", e.target.value)
                }
                placeholder="Enter thumbnail path"
              />
            </div>
          </div>
        </div>
      ))}

      <Button onClick={addNewVideo} className="w-full">
        Add New Video Entry
      </Button>
    </div>
  );
};

export const DocumentInput = ({ value = [], setValue }) => {
  const addNewDocument = () => {
    setValue([
      ...value,
      {
        title: "",
        file_path: "",
        mime_type: "",
        description: "",
        thumbnail_path: "",
        created_by: 1,

      },
    ]);
  };

  const updateDocument = (index, field, newValue) => {
    const newData = [...value];
    newData[index][field] = newValue;
    newData[index].updated_at = new Date().toISOString();
    setValue(newData);
  };

  const removeDocument = (index) => {
    const newData = [...value];
    newData.splice(index, 1);
    setValue(newData);
  };

  return (
    <div className="space-y-4">
      {value.map((document, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Document Entry {index + 1}</h4>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeDocument(index)}
            >
              Remove
            </Button>
          </div>

          <div className="grid gap-3">
            <div>
              <Label>Title</Label>
              <Input
                value={document.title}
                onChange={(e) => updateDocument(index, "title", e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={document.description}
                onChange={(e) =>
                  updateDocument(index, "description", e.target.value)
                }
                placeholder="Enter description"
              />
            </div>

            <div>
              <Label>File Path</Label>
              <Input
                value={document.file_path}
                onChange={(e) =>
                  updateDocument(index, "file_path", e.target.value)
                }
                placeholder="Enter file path"
              />
            </div>

            <div>
              <Label>Thumbnail Path</Label>
              <Input
                value={document.thumbnail_path}
                onChange={(e) =>
                  updateDocument(index, "thumbnail_path", e.target.value)
                }
                placeholder="Enter thumbnail path"
              />
            </div>
          </div>
        </div>
      ))}

      <Button onClick={addNewDocument} className="w-full">
        Add New Document Entry
      </Button>
    </div>
  );
};

export const AudioInput = ({ value = [], setValue }) => {
  const addNewAudio = () => {
    setValue([
      ...value,
      {
        title: "",
        description: "",
        file_path: "",
        thumbnail_path: "",
        lyrics: "",
        genre: [],
        composer: "",
        performers: [],
        instruments: [],
        mime_type: "",
        created_by: 1,

      },
    ]);
  };

  const updateAudio = (index, field, newValue) => {
    const newData = [...value];
    if (["genre", "performers", "instruments"].includes(field)) {
      // Handle array fields by splitting comma-separated values
      newData[index][field] = newValue.split(",").map((item) => item.trim());
    } else {
      newData[index][field] = newValue;
    }
    setValue(newData);
  };

  const removeAudio = (index) => {
    const newData = [...value];
    newData.splice(index, 1);
    setValue(newData);
  };

  return (
    <div className="space-y-4">
      {value.map((audio, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Audio Entry {index + 1}</h4>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeAudio(index)}
            >
              Remove
            </Button>
          </div>

          <div className="grid gap-3">
            <div>
              <Label>Title</Label>
              <Input
                value={audio.title}
                onChange={(e) => updateAudio(index, "title", e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={audio.description}
                onChange={(e) =>
                  updateAudio(index, "description", e.target.value)
                }
                placeholder="Enter description"
              />
            </div>

            <div>
              <Label>File Path</Label>
              <Input
                value={audio.file_path}
                onChange={(e) =>
                  updateAudio(index, "file_path", e.target.value)
                }
                placeholder="Enter file path"
              />
            </div>

            <div>
              <Label>Thumbnail Path</Label>
              <Input
                value={audio.thumbnail_path}
                onChange={(e) =>
                  updateAudio(index, "thumbnail_path", e.target.value)
                }
                placeholder="Enter thumbnail path"
              />
            </div>

            <div>
              <Label>Lyrics</Label>
              <Input
                value={audio.lyrics}
                onChange={(e) => updateAudio(index, "lyrics", e.target.value)}
                placeholder="Enter lyrics"
              />
            </div>

            <div>
              <Label>Genre (comma-separated)</Label>
              <Input
                value={audio.genre.join(", ")}
                onChange={(e) => updateAudio(index, "genre", e.target.value)}
                placeholder="Enter genres (e.g., Rock, Jazz, Classical)"
              />
            </div>

            <div>
              <Label>Composer</Label>
              <Input
                value={audio.composer}
                onChange={(e) => updateAudio(index, "composer", e.target.value)}
                placeholder="Enter composer name"
              />
            </div>

            <div>
              <Label>Performers (comma-separated)</Label>
              <Input
                value={audio.performers.join(", ")}
                onChange={(e) =>
                  updateAudio(index, "performers", e.target.value)
                }
                placeholder="Enter performers"
              />
            </div>

            <div>
              <Label>Instruments (comma-separated)</Label>
              <Input
                value={audio.instruments.join(", ")}
                onChange={(e) =>
                  updateAudio(index, "instruments", e.target.value)
                }
                placeholder="Enter instruments"
              />
            </div>
          </div>
        </div>
      ))}

      <Button onClick={addNewAudio} className="w-full">
        Add New Audio Entry
      </Button>
    </div>
  );
};


const ArrayInput = ({ value, setValue }) => {
  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            type="text"
            value={item}
            onChange={(e) => {
              const newValue = [...value];
              newValue[index] = e.target.value;
              setValue(newValue);
            }}
          />
          <Button
            variant="danger"
            onClick={() => {
              const newValue = [...value];
              newValue.splice(index, 1);
              setValue(newValue);
            }}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button onClick={() => setValue([...value, ""])} className="w-full">
        Add
      </Button>
    </div>
  );
};


const RenderAttributes = ({
  attribute,
  attributeValues,
  setAttributeValues,
  attributeTypes,
}) => {
  const [arrayValue, setArrayValue] = useState([]);
  const [audioValue, setAudioValue] = useState([]);
  const [videoValue, setVideoValue] = useState([]);
  const [documentValue, setDocumentValue] = useState([]);
  // Find the attribute type
  const attributeType = attributeTypes.find(
    (type) => type.id === attribute.attribute_type_id
  );
  if (!attributeType) return null;

  // Handle Relations type (6)
  if (attribute.attribute_type_id === 6) {
    return (
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Name"
          value={attributeValues[attribute.id]?.name || ""}
          onChange={(e) =>
            setAttributeValues((prev) => ({
              ...prev,
              [attribute.id]: {
                ...prev[attribute.id],
                name: e.target.value,
                associated_table: "tribes",
                associated_table_id: 1, // You might want to make this dynamic
              },
            }))
          }
        />
      </div>
    );
  }
  if (attribute.attribute_type_id === 1) {
    return (
      <Input
        type="text"
        value={attributeValues[attribute.id]?.value || ""}
        onChange={(e) =>
          setAttributeValues((prev) => ({
            ...prev,
            [attribute.id]: { value: e.target.value },
          }))
        }
        placeholder={attribute.description}
        required={attribute.is_required}
      />
    );
  } 
   if (attribute.attribute_type_id === 2) {
    return (
      <div>
        <Label>{attribute.description}</Label>
        <ArrayInput value={arrayValue} setValue={setArrayValue} />
        <button
          onClick={() => {
            setAttributeValues((prev) => ({
              ...prev,
              [attribute.id]: { value: arrayValue },
            }));
          }}
        >
          Submit
        </button>
      </div>
    );
  }

  if (attribute.attribute_type_id === 8) {
    return (
      <div>
        <Label>{attribute.description}</Label>
        <AudioInput 
          value={attributeValues[attribute.id]?.value || []}
          setValue={(newValue) =>
            setAttributeValues((prev) => ({
              ...prev,
              [attribute.id]: { value: newValue },
            }))
          }
        />
      </div>
    );
  }

  // Handle Video type (9)
  if (attribute.attribute_type_id === 9) {
    return (
      <div>
        <Label>{attribute.description}</Label>
        <VideoInput 
          value={attributeValues[attribute.id]?.value || []}
          setValue={(newValue) =>
            setAttributeValues((prev) => ({
              ...prev,
              [attribute.id]: { value: newValue },
            }))
          }
        />
      </div>
    );
  }

  // Handle Document type (10)
  if (attribute.attribute_type_id === 10) {
    return (
      <div>
        <Label>{attribute.description}</Label>
        <DocumentInput 
          value={attributeValues[attribute.id]?.value || []}
          setValue={(newValue) =>
            setAttributeValues((prev) => ({
              ...prev,
              [attribute.id]: { value: newValue },
            }))
          }
        />
      </div>
    );
  }


  // Default text input for other types
  return (
    <Input
      type="text"
      value={attributeValues[attribute.id]?.value || ""}
      onChange={(e) =>
        setAttributeValues((prev) => ({
          ...prev,
          [attribute.id]: { value: e.target.value },
        }))
      }
      placeholder={attribute.description}
      required={attribute.is_required}
    />
  );
};

export default RenderAttributes;

Below is a concise documentation explaining the tribe and category concepts, how attributes work for each, and the importance of attribute types (including their value_structure.example for validation).

Documentation: Tribes, Categories, and Attributes

1. Entities Overview

1.1. Tribes
	•	Represents a community or ethnic group in the system.
	•	Each tribe can have n attributes, such as name, history, distribution, etc.
	•	New attributes for tribes apply to all tribes globally:
	•	If a new tribe attribute is created, it’s visible for every tribe.
	•	If a tribe attribute is deactivated, it’s hidden for all tribes.

1.2. Categories
	•	Represents a distinct classification (e.g., “Folk Music,” “Artifacts,” etc.).
	•	Each category also can have n attributes, but these are specific to a category:
	•	A newly created category attribute is only visible to that particular category.
	•	Deactivating a category attribute hides it only for that category.

2. Attributes and Prefix Rules
	1.	Tribe Attributes
	•	Are prefixed with "tribe-".
	•	Example:
	•	User wants to create “Historical Distribution,” which becomes tribe-HistoricalDistribution.
	•	All tribes share the same set of possible attributes (though each tribe might have different content values for each attribute).
	2.	Category Attributes
	•	Are specific to a single category.
	•	No global prefix or name pattern is enforced by default, but you can adopt "cat-FolkMusic-History" or similar naming if desired.
	•	The key point is each category manages its own attributes.

3. Attribute Types

attribute_types table defines the data type and JSON schema for an attribute. Examples:
	•	Text: Simple text with certain length constraints.
	•	Media: Storing images, audio, or video references.
	•	Array: A list of string items.
	•	Date: Must be a valid date string (YYYY-MM-DD).
	•	Number: A numeric value (with optional decimal).
	•	Boolean: true or false.
	•	Relations: References to other domain records (like an array of { associated_table, associated_table_id, name }).

Each attribute_types record includes:
	•	validation_rules: JSON specifying constraints (max length, allowed MIME types, etc.).
	•	value_structure: Another JSON specifying:
	•	type: e.g., "normalText", "mediaStorage", "relationsToOtherTables"
	•	example: A minimal example object to show the required shape (e.g. {"value": "String"}).

4. Content Table & value_structure.example
	1.	content Table
	•	Stores the actual values for each attribute.
	•	Key columns:
	•	associated_table (e.g., 'tribe' or 'category'),
	•	associated_table_id (the tribe or category ID),
	•	attribute_id (links to attributes),
	•	value (a JSON column storing the attribute’s data).
	2.	Value Field Must Match the value_structure.example
	•	For each attribute, we know its attribute_type_id → from there, we retrieve value_structure in attribute_types.
	•	The schema of data in content.value should follow the shape of value_structure.example.
	•	Examples:
	•	If type="normalText", content.value is expected to look like:

{ "value": "some string" }


	•	If type="mediaStorage", we might expect:

{
  "files": [
    {
      "url": "https://example.com/file.jpg",
      "type": "image/jpeg",
      "description": "An example image"
    }
  ]
}


	•	If type="relationsToOtherTables", you might see:

{
  "value": [
    {
      "associated_table": "tribes",
      "associated_table_id": 1,
      "name": "Adi"
    }
  ]
}



By validating your content.value against the value_structure.example (or a more detailed schema derived from it), you ensure the data in content is consistent and recognized by your application.

5. Behavioral Summary
	•	Tribe Attributes
	•	Shared across all tribes.
	•	Prefix: 'tribe-' + <CamelCaseName>
	•	If deactivated, hidden for every tribe.
	•	Category Attributes
	•	Specific to a single category.
	•	No global prefix required, but can adopt a custom naming scheme.
	•	Deactivation/hiding applies only to that category.
	•	Attribute Types
	•	Define how data is structured and validated (validation_rules + value_structure).
	•	Examples: Text, Media, Array, etc.
	•	Content
	•	Stores the actual values in content.value.
	•	Must conform to the value_structure.example for that attribute type.
	•	e.g., A “Text” type attribute must store {"value": "some string"}.

6. Typical Workflow
	1.	Admin Creates a New Tribe Attribute
	•	e.g., “Tribe Images” of type Media.
	•	This new attribute automatically applies to all tribes.
	2.	User Updates a Tribe
	•	The user’s request must supply the attribute_id and a value following the shape from Media’s value_structure.example:

{
  "files": [
    { "url": "https://example.com/abc.jpg", "type": "image/jpeg" }
  ]
}


	•	If it’s valid, the system INSERTs or UPDATEs a row in content.

	3.	Fetching a Tribe
	•	The system merges tribes with all attributes in content, returning a structured JSON that includes each attribute’s data.

7. Advantages of This Approach
	•	Consistency: All “Text” attributes have the same JSON shape. All “Media” attributes store an array of files.
	•	Flexibility: New attribute types can be introduced by defining new entries in attribute_types.
	•	Scalability: Validation ensures the application doesn’t ingest malformed data.

In Conclusion
	•	Tribes share global attributes.
	•	Categories have local attributes.
	•	Attribute types define the data structure expected in content.value.
	•	By referencing value_structure.example, you validate each content.value to keep consistent shapes across your application.
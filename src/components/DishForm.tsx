import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import Message from "./Message";

const DishForm = () => {
  const [name, setName] = useState<string>("");
  const [preparationTime, setPreparationTime] = useState<string>("01:00:00");
  const [dishType, setDishType] = useState<string>("");
  const [noOfSlices, setNoOfSlices] = useState<number>(1);
  const [diameter, setDiameter] = useState<number>(1);
  const [spicinessScale, setSpicinessScale] = useState<number>(1);
  const [slicesOfBread, setSlicesOfBread] = useState<number>(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Reset messages
    setErrors([]);
    setMessage("");

    // Create data to send
    const commonFields = {
      name: name,
      preparation_time: preparationTime,
      type: dishType,
    };

    const formDataConfig = {
      pizza: {
        ...commonFields,
        no_of_slices: noOfSlices,
        diameter: diameter,
      },
      soup: {
        ...commonFields,
        spiciness_scale: spicinessScale,
      },
      sandwich: {
        ...commonFields,
        slices_of_bread: slicesOfBread,
      },
    };

    let formData;
    if (dishType === "pizza") formData = formDataConfig.pizza;
    if (dishType === "soup") formData = formDataConfig.soup;
    if (dishType === "sandwich") formData = formDataConfig.sandwich;

    console.log(formData);

    // Try to POST data
    try {
      const response = await fetch(
        "https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        // Handle successful submission
        console.log("Form submitted successfully");
        console.log(`Response: ${await response.text()}`);
        setMessage("Form submitted successfully");
        resetInputs();
      } else {
        // Handle unsuccessful submission
        const data = await response.json();
        const entries = Object.entries(data).map(
          (value) => `${convertToTitleCase(value[0])} - ${value[1]}`
        );

        setErrors((err) => [...err, ...entries]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Reset all inputs to default
  const resetInputs = function() {
    setDishType("Select");
    setName("");
    setDiameter(1);
    setNoOfSlices(1);
    setPreparationTime("01:00:00");
    setSlicesOfBread(1);
    setSpicinessScale(1);
  };

  // Convert string to title case
  const convertToTitleCase = function(str: string) {
    return str
      .replace(/_([a-z])/g, function(_, letter) {
        return " " + letter.toUpperCase();
      })
      .replace(/^\w/, function(firstLetter) {
        return firstLetter.toUpperCase();
      });
  };

  // Change dish type state
  const handleDishTypeChange = (e: any) => {
    setDishType(e.target.value);
  };

  // Render pizza fields
  const renderPizzaFields = () => {
    if (dishType === "pizza") {
      return (
        <div>
          <label>
            Number of Slices:
            <input
              type="number"
              min="1"
              value={noOfSlices}
              onChange={(e) => setNoOfSlices(+e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Diameter (cm):
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={diameter}
              onChange={(e) => setDiameter(+e.target.value)}
              required
            />
          </label>
          <br />
        </div>
      );
    }
  };

  // Render soup field
  const renderSoupFields = () => {
    if (dishType === "soup") {
      return (
        <div>
          <label>
            Spiciness Scale (1-10):
            <input
              type="number"
              min="1"
              max="10"
              value={spicinessScale}
              onChange={(e) => setSpicinessScale(+e.target.value)}
              required
            />
          </label>
          <br />
        </div>
      );
    }
  };

  // Render sandwich field
  const renderSandwichFields = () => {
    if (dishType === "sandwich") {
      return (
        <div>
          <label>
            Slices of Bread:
            <input
              type="number"
              min="1"
              value={slicesOfBread}
              onChange={(e) => setSlicesOfBread(+e.target.value)}
              required
            />
          </label>
          <br />
        </div>
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          placeholder="Enter the dish name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Preparation Time:
        <input
          type="time"
          step="1"
          value={preparationTime}
          onChange={(e) => setPreparationTime(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Dish Type:
        <select value={dishType} onChange={handleDishTypeChange} required>
          <option value="">Select</option>
          <option value="pizza">Pizza</option>
          <option value="soup">Soup</option>
          <option value="sandwich">Sandwich</option>
        </select>
      </label>
      <br />

      {renderPizzaFields()}
      {renderSoupFields()}
      {renderSandwichFields()}

      <button type="submit">Submit</button>

      {errors && errors.length > 0 && <ErrorMessage message={errors} />}

      {message && <Message message={message} />}
    </form>
  );
};

export default DishForm;

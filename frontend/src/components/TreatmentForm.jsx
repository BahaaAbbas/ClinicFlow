import { useState } from "react";

const TreatmentForm = ({ onSubmit }) => {
  const [treatment, setTreatment] = useState({
    name: "",
    cost: "",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (treatment.name && treatment.cost) {
      onSubmit({
        name: treatment.name,
        cost: parseFloat(treatment.cost),
        notes: treatment.notes,
      });
      setTreatment({ name: "", cost: "", notes: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Treatment Name</label>
        <input
          type="text"
          className="form-control"
          value={treatment.name}
          onChange={(e) => setTreatment({ ...treatment, name: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Cost ($)</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={treatment.cost}
          onChange={(e) => setTreatment({ ...treatment, cost: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Notes (Optional)</label>
        <textarea
          className="form-control"
          value={treatment.notes}
          onChange={(e) =>
            setTreatment({ ...treatment, notes: e.target.value })
          }
          rows="2"
        />
      </div>
      <button type="submit" className="btn btn-success">
        Add Treatment
      </button>
    </form>
  );
};
export default TreatmentForm;

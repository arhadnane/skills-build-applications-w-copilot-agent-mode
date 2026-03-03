import { useMemo, useState } from 'react';

function toFormState(fields) {
  return fields.reduce((accumulator, field) => {
    accumulator[field.name] = '';
    return accumulator;
  }, {});
}

function DataSection({ title, description, linkHref, linkLabel, columns, data, fields, onCreate }) {
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState(() => toFormState(fields));

  const normalizedData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreate(formState);
    setFormState(toFormState(fields));
    setShowModal(false);
  };

  return (
    <section className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
          <div>
            <h2 className="h4 mb-1">{title}</h2>
            <p className="text-secondary mb-0">{description}</p>
          </div>
          <div className="d-flex gap-2">
            <a className="btn btn-outline-primary btn-sm" href={linkHref} target="_blank" rel="noreferrer">
              {linkLabel}
            </a>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              Add {title}
            </button>
          </div>
        </div>

        <div className="table-responsive octo-table-wrapper">
          <table className="table table-striped table-hover align-middle octo-table mb-0">
            <thead className="table-light">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} scope="col">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {normalizedData.length === 0 ? (
                <tr>
                  <td className="text-muted text-center" colSpan={columns.length}>
                    No data available.
                  </td>
                </tr>
              ) : (
                normalizedData.map((item, index) => (
                  <tr key={item.id || `${title}-${index}`}>
                    {columns.map((column) => (
                      <td key={`${column.key}-${index}`}>{column.render ? column.render(item) : item[column.key]}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Create {title}</h3>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)} />
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      {fields.map((field) => (
                        <div className="col-md-6" key={field.name}>
                          <label className="form-label" htmlFor={field.name}>
                            {field.label}
                          </label>
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type || 'text'}
                            className="form-control"
                            value={formState[field.name]}
                            onChange={handleInputChange}
                            required={field.required !== false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </section>
  );
}

export default DataSection;

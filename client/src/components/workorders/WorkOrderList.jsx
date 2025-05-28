import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Input } from "reactstrap";
import {
  getIncompleteWorkOrders,
  updateWorkOrder,
  completeWorkOrder,
  deleteWorkOrder,
} from "../../managers/workOrderManager";
import { getUserProfiles } from "../../managers/userProfileManager";

export const WorkOrderList = ({ loggedInUser }) => {
  const [workOrders, setWorkOrders] = useState([]);
  const [mechanics, setMechanics] = useState([]);

  useEffect(() => {
    getIncompleteWorkOrders().then(setWorkOrders);
    getUserProfiles().then(setMechanics);
  }, []);

  const assignMechanic = (workOrder, mechanicId) => {
    const clone = structuredClone(workOrder);
    clone.userProfileId = mechanicId || null;

    updateWorkOrder(clone).then(() => {
      getIncompleteWorkOrders().then(setWorkOrders);
    });
  };

  const markComplete = (id) => {
    completeWorkOrder(id).then(() => {
      getIncompleteWorkOrders().then(setWorkOrders);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this work order?")) {
      deleteWorkOrder(id).then(() => {
        getIncompleteWorkOrders().then(setWorkOrders);
      });
    }
  };

  return (
    <>
      <h2>Open Work Orders</h2>
      <Link to="/workorders/create">New Work Order</Link>
      <Table>
        <thead>
          <tr>
            <th>Owner</th>
            <th>Brand</th>
            <th>Color</th>
            <th>Description</th>
            <th>DateSubmitted</th>
            <th>Mechanic</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workOrders.map((wo) => (
            <tr key={wo.id}>
              <th scope="row">{wo.bike.owner.name}</th>
              <td>{wo.bike.brand}</td>
              <td>{wo.bike.color}</td>
              <td>{wo.description}</td>
              <td>{new Date(wo.dateInitiated).toLocaleDateString()}</td>
              <td>
                <Input
                  type="select"
                  value={wo.userProfileId || 0}
                  onChange={(e) => assignMechanic(wo, parseInt(e.target.value))}
                >
                  <option value={0}>Choose mechanic</option>
                  {mechanics.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName}
                    </option>
                  ))}
                </Input>
              </td>
              <td>
                {wo.userProfile && (
                  <Button
                    size="sm"
                    color="success"
                    onClick={() => markComplete(wo.id)}
                    className="me-2"
                  >
                    Mark as Complete
                  </Button>
                )}
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => handleDelete(wo.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

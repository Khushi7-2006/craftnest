import { api } from "../../services/api";
import api from "../../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await api.get("/api/users/customers");
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <p>Loading customers...</p>;
  }

  return (
    <div className="page-container">
      <h1>Customers</h1>

      {customers.length === 0 ? (
        <p>No registered customers found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name || "—"}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Customers;

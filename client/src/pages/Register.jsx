// Find where you're setting the role value and update it to use lowercase
// For example, if you have a dropdown or select input:

<select 
  name="role" 
  value={formData.role} 
  onChange={handleChange}
  className="form-select"
>
  <option value="user">Customer</option>
  <option value="seller">Seller</option>
  <option value="grower">Grower</option>
  <option value="supplier">Supplier</option>
</select>
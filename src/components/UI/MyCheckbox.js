import classes from "./MyCheckbox.module.css";
const Checkbox = ({ label, isChecked, setIsChecked }) => {
  return (
    <div className={classes['checkbox-wrapper']}>
      <label>
        <input type="checkbox" checked={isChecked}  onChange={setIsChecked}  className={isChecked ? classes.checked : ""}/>
        <span>{label}</span>
      </label>
    </div>
  );
};
export default Checkbox;
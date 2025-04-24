import { Button, ButtonProps } from '@mui/material';

export default function MyButton(props: ButtonProps) {
  return (
    <Button
      variant="contained"
      color="primary"
      className="rounded-xl shadow-md"
      {...props}
    />
  );
}
import {Backdrop, LinearProgress} from '@mui/material'

interface LoadingOverlayProps {
  open: boolean
}

export function LoadingOverlay({open}: LoadingOverlayProps) {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        flexDirection: 'column',
      }}
    >
      <div style={{width: '50%', maxWidth: 400}}>
        <LinearProgress color="primary" />
      </div>
    </Backdrop>
  )
}

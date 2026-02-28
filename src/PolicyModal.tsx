import {Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, Typography} from '@mui/material'
import {Close} from '@mui/icons-material'
import {ReactNode} from 'react'

interface PolicyModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export const PolicyModal = ({open, onClose, title, children}: PolicyModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      aria-labelledby="policy-dialog-title"
    >
      <DialogTitle id="policy-dialog-title" sx={{paddingRight: 6}}>
        <Typography variant="h5" component="div" fontWeight="bold">
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

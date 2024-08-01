'use client'
import Image from "next/image"
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button, InputAdornment } from '@mui/material'
import { collection, deleteDoc, doc, getDocs, getDoc, setDoc, query } from 'firebase/firestore'
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [addItemModalOpen, setAddItemModalOpen] = useState(false)
  const [editItemModalOpen, setEditItemModalOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [editQuantity, setEditQuantity] = useState(1)
  const [editItemName, setEditItemName] = useState('')
  const [existingQuantity, setExistingQuantity] = useState(0)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data()
      await setDoc(docRef, { quantity: existingQuantity + quantity })
    } else {
      await setDoc(docRef, { quantity: quantity })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    await deleteDoc(docRef)
    await updateInventory()
  }

  const editItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const newQuantity = editQuantity;

    if (newQuantity < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    await setDoc(docRef, { quantity: newQuantity });
    await updateInventory();
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleAddItemOpen = () => {
    setAddItemModalOpen(true)
    setItemName('')
    setQuantity(1)
  }
  const handleAddItemClose = () => setAddItemModalOpen(false)

  const handleEditItemOpen = (item, currentQuantity) => {
    setEditItemName(item)
    setEditQuantity(currentQuantity) 
    setExistingQuantity(currentQuantity)
    setEditItemModalOpen(true)
  }
  const handleEditItemClose = () => setEditItemModalOpen(false)

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Modal open={addItemModalOpen} onClose={handleAddItemClose}>
        <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: 'translate(-50%, -50%)' }}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              variant='outlined'
              type='number'
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              inputProps={{ min: 1 }}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                handleAddItemClose();
              }}
            >
              Add Item
            </Button>
            <Button
              variant="outlined"
              onClick={handleAddItemClose}
            >
              Close
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={editItemModalOpen} onClose={handleEditItemClose}>
        <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: 'translate(-50%, -50%)' }}>
          <Typography variant="h6">Edit Item: {editItemName}</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              type='number'
              label="New Quantity"
              value={editQuantity}
              onChange={(e) => setEditQuantity(Number(e.target.value))}
              inputProps={{ min: 0 }}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => {
                editItem(editItemName);
                handleEditItemClose();
              }}
            >
              Update Quantity
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Stack direction="column" spacing={2} alignItems="center">
        <TextField
          variant='outlined'
          placeholder="Search Items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            borderRadius: '25px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
            },
            backgroundColor: 'white'
          }}
        />
        
        <Button variant="contained" onClick={handleAddItemOpen}>+ Add Item</Button>
      </Stack>

      <Box border="0.5px solid #333" width="800px" borderRadius="10px" boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)" overflow="hidden"> 
        <Stack width="100%" height="100%">
          <Box width="100%" height="100px" bgcolor="#FFFFFF" display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h4" color="#333">Pantry Items</Typography>
          </Box>
          <Box width="100%" height="300px" bgcolor="#FFFFFF" overflow="auto">
            <Stack width="100%" spacing={2} padding={2}>
              {inventory
                .slice()
                .reverse()
                .filter(({ name }) => name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(({ name, quantity }) => (
                  <Box
                    key={name}
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    backgroundColor="#F0F8FF"
                    padding={2} 
                    borderRadius="15px" 
                    boxShadow={1}
                  >
                    <Typography variant="h6" color="#333" textAlign="center">
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography variant="h6" color="#333" textAlign="center">
                      Quantity: {quantity}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        onClick={() => handleEditItemOpen(name, quantity)}
                        startIcon={<ShoppingCartIcon />}
                      >
                        Edit Quantity
                      </Button>
                      <Button variant="contained" onClick={() => removeItem(name)} startIcon={<DeleteIcon />}>
                        Remove
                      </Button>
                    </Stack>
                  </Box>
                ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

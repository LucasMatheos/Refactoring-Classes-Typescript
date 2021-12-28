import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood/";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

const Dashboard = () => {
  const [foods, setFoods] = useState<Product[]>([]);
  const [editingFood, setEditingFood] = useState<Product>({} as Product);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get<Product[]>("/foods");
      setFoods(response.data);
    }
    loadProducts();
  }, []);

  const handleAddFood = async (food: Product) => {
    try {
      const response = await api.post<Product>("/foods", {
        ...food,
        available: true,
      });
      const updatedFoods = [...foods];
      updatedFoods.push(response.data);
      setFoods(updatedFoods);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: Product) => {
    try {
      const foodUpdated = await api.put<Product>(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });
      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );
      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
    
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    
  };
  const handleEditFood = (food: Product) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;

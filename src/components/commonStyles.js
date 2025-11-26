import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#3B5998', // Azul principal
  secondary: '#FF6347', // Laranja/Coral
  white: '#FFFFFF',
  lightGray: '#F6F6F6',
  gray: '#7e7e7eff', // Cinza escuro para bordas/ícones
  grayLight: '#e0e0e0', // Cinza claro para bordas suaves
  darkBlue: '#2D4373',
  red: '#ffffffff',
  text: '#333333',
  success: '#4CAF50' // Adicionado para telas de sucesso
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
  },
  // Input simples (sem ícone)
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.gray,
    color: COLORS.text,
  },
  // Container para Input com Ícone (Novo)
  inputWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  // O texto dentro do input com ícone
  inputInside: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.text,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: COLORS.primary,
    marginTop: 15,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 30,
    textAlign: 'center',
  }
});
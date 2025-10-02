import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#3B5998', // Azul principal
  secondary: '#FF6347', // Laranja/Coral para a logo
  white: '#FFFFFF',
  lightGray: '#F6F6F6',
  gray: '#CCCCCC',
  darkBlue: '#2D4373',
  text: '#333333'
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
  },
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
  }
});
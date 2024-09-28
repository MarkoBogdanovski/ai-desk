import { useState, useEffect } from 'react';

export function useTensorflowModel() {
  const [model, setModel] = useState<any | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const tf = await import('@tensorflow/tfjs');
        await tf.ready();
        const use = await import('@tensorflow-models/universal-sentence-encoder');
        const loadedModel = await use.load();
        setModel(loadedModel);
      } catch (error) {
        console.error('Error loading TensorFlow.js or model:', error);
      }
    };
    loadModel();
  }, []);

  return model;
}

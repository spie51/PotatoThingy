from flask import Flask, request
import tensorflow as tf
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
import numpy as np
from flask_cors import CORS

# Initializing flask app
app = Flask(__name__)
CORS(app)

model = tf.keras.models.load_model('potatoes.h5')
IMAGE_SIZE = 256
BATCH_SIZE = 32

dataset = tf.keras.preprocessing.image_dataset_from_directory(
    "PlantVillage",
    seed=123,
    shuffle=True,
    image_size=(IMAGE_SIZE,IMAGE_SIZE),
    batch_size=BATCH_SIZE
)

class_names = dataset.class_names
print(class_names)

def load_image(filename):
    img = load_img(filename, target_size=(IMAGE_SIZE, IMAGE_SIZE))
    return img

# Route for seeing a data
@app.route('/data')
async def get_time():

	# Returning an api for showing in reactjs
	return {
		'Name':"geek", 
		"Age":"22",
		"programming":"python"
		}

@app.route('/dummypredict')
async def predict():
    src = 'PlantVillage/Potato___Late_blight/0acdc2b2-0dde-4073-8542-6fca275ab974___RS_LB 4857.JPG'
    img = load_image(src);
	
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)

    predictions = model.predict(img_array)
    predicted_class = class_names[np.argmax(predictions[0])]
    actual_class = src.split("/")[1];
    confidence = round(100 * (np.max(predictions[0])), 2)
    print(f"Actual: {actual_class},\n Predicted: {predicted_class}.\n Confidence: {confidence}%")

    # img_array = tf.keras.preprocessing.image.img_to_array(img)
    # img_array = tf.expand_dims(img_array, 0)

    # # image = read_file_as_image(await file.read())
    # # img_batch = np.expand_dims(image, 0)
    # # predictions = MODEL.predict(img_batch)
    
    # predictions = MODEL.predict(img_array)

    # predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    # confidence = np.max(predictions[0])

	# Returning an api for showing in reactjs
    return {
        'class': predicted_class,
        'confidence': confidence
    }

@app.route("/predict", methods=["POST"])
def processReq():
    data = request.files["file"]
    data.save("img.jpg")
    img = load_image("img.jpg");

    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)

    predictions = model.predict(img_array)
    predicted_class = class_names[np.argmax(predictions[0])]
    confidence = round(100 * (np.max(predictions[0])), 2)
    print(f"Predicted: {predicted_class}.\n Confidence: {confidence}%")

    return {
        'class': predicted_class,
        'confidence': confidence
    }

	
# Running app
if __name__ == '__main__':
	app.run(debug=True)

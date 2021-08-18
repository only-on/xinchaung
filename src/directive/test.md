<p style="background-color:#00b0f0; padding: 5px; margin: 3px auto; widows:3; orphans:3;"><span style="color:#ffffff;font-size: 24px; font-weight: bold;">基于卷积神经网络的人脸识别技术</span></p>

### 一、任务目的
熟悉和掌握深度卷积神经网络的原理和应用，以及深度卷积神经网络较浅层神经网络的区别和深度卷积神经网络在训练过程中存在的问题，即梯度弥散/爆炸导致训练深层次网络时无法收敛的问题。理解ResNet深层网络模型的结构，以及其引入残差网络解决收敛问题的方法和减小参数个数加快训练过程的方法。学习使用Keras库函数快速搭建ResNet深层卷积网络模型和使用GPU加快模型的训练过程。

### 二、任务内容
编写TensorFlow框架的CNN网络，利用Keras库可简单快速的搭建卷积网络。利用数据流编程的方法编写50层ResNet模型结构，如下图1所示，包含了多个3层恒等残差块和3层卷积残差块。将FERET人脸数据库划分为测试集和训练集，并生成对应的独热码标签。因为每个人只有7张人脸图片，所以只使用1张来做测试，其余6张人脸图片训练。基于该深层网络训练ResNet模型，得到训练权重并在测试集上测试模型的正确率和性能。本次实验还将调用GPU加快模型的训练过程。最后利用美剧视频和人脸检测获取人脸数据集，并手动标注数据集，在ResNet下训练网络，在美剧中应用人脸识别技术。

<center>

![](/upload/imagePath/5dc90a41bed2d.jpg)
图1 50层ResNet模型

</center>

### 三、任务环境
硬件：GPU服务器、PC上位机
软件：python3.5、Jupyter notebook、FERET人脸数据库、美剧视频、Tensorflow GPU版本>=1.8.0版本、Keras库等


### 四、任务原理
卷积神经网络在图像分类中显示出了巨大的威力，通过学习得到的卷积核（权重）明显优于人工设计的特征+分类器的方案。人脸识别利用卷积神经网络（CNN）对海量的人脸图片进行学习，然后从输入图像中提取出对可以区分不同人脸的有用特征向量，从而替代了人工设计特征的方法。
在深度学习网络中，深度对最后的分类和识别的效果有着很大的影响，但并非所设计的网络越深性能越好，常规的网络的堆叠在网络很深的时候，效果越来越差了。其中原因之一即是网络越深，梯度消失的现象就越来越明显，网络的训练效果也不会很好。但是浅层的网络又无法明显提升网络的识别效果，所以现在要解决的问题就是怎样在加深网络的情况下又解决梯度消失的问题。ResNet网络提供了有效的解决方案，即残差网络。如下图3所示为34层的ResNet残差网络。与普通的卷积网络不同，该网络在间隔2个卷积运算之间加入了直连的前向传播，称该连接为shortcut connection。shortcut connection结构如下图2所示：

<center>

![](/upload/imagePath/5dc90a536ef87.jpg)
图2 残差函数

</center>

通过两层卷积网络得到的输出为：
![](/upload/imagePath/5dca4cfc7bbf2.gif)

该F输出与X相加得到输出 Y，学习得到的网络![](/upload/imagePath/5dca4d8835260.gif)即为残差函数。
![](/upload/imagePath/5dca4dbd49323.gif)
以上需要考虑到![](/upload/imagePath/5dca4edbdd553.gif)和X维数相同的，当位数不同时，为X添加维度变换：
![](/upload/imagePath/5dca4dfb957d8.gif)
根据![](/upload/imagePath/5dca4eb64e595.gif)和X维数，将残差网络分为不同的网络模块，下图4为维数相同时的3层恒等残差模块：
<center>![](/upload/imagePath/5dc90a65f36fc.png)
图3 残差网络结构
![](/upload/imagePath/5dc90a766629c.jpg)
图4 3层恒等残差块</center>

下图5为维数不同时的3层卷积残差模块。shortcut路径中的CONV2D用于将输入x调整为不同的尺寸，以便在shortcut残差块的值返回到主路径时矩阵加法的尺寸相匹配（与矩阵Ws的作用相同）。例如，要将shortcut输出矩阵维度的高度和宽度缩小2倍，可以使用步长为2的1x1卷积。shortcut路径上的CONV2D层路径不使用任何非线性激活函数。
<center>![](/upload/imagePath/5dc90a89c8dff.jpg)
图5 3层卷积残差块</center>

下图6为两种ResNet结构分别针对ResNet34（左图）和ResNet50/101/152（右图）。采用右图这种结构是为了降低参数的数目，第一个1x1的卷积把256维channel特征图像降到64维，然后在最后通过1x1卷积恢复，整体上用的参数数目为：1x1x256x64 + 3x3x64x64 + 1x1x64x256 = 69632，而不使用该方法（即采用中间结构）就是两个3x3x256的卷积计算，参数数目为: 3x3x256x256x2 = 1179648，两者差了16.94倍。
<center>![](/upload/imagePath/5dc90a9c09b29.jpg)
图6 两种ResNet结构</center>

BatchNormalization（批标准化）把每层神经网络任意神经元输入值的分布强行拉回到均值为0方差为1的标准正态分布，把越来越偏的分布强制拉回比较标准的分布，这样使得激活输入值落在非线性函数对输入比较敏感的区域，这样输入的小变化就会导致损失函数较大的变化。BatchNorm经常使用在mini-batch上。
常用的批处理方式有：
1）Batch Gradient Descent，批梯度下降，遍历全部数据集计算一次损失函数，进行一次参数更新，这样得到的方向能够更加准确的指向极值的方向，但是计算开销大，速度慢；
（2）Stochastic Gradient Descent，随机梯度下降，对每一个样本计算一次损失函数，进行一次参数更新，优点是速度快，缺点是方向波动大，忽东忽西，不能准确的指向极值的方向，有时甚至两次更新相互抵消；
（3）Mini-batch Gradient Decent，小批梯度下降，前面两种方法的折中，把样本数据分为若干批，分批来计算损失函数和更新参数，这样方向比较稳定，计算开销也相对较小。

###五、任务步骤
####5.1、FERET数据集人脸分类
1、在“/data”目录下打开jupyter notebook软件。
<center>![](/upload/imagePath/5dc90ace99db0.png)
图7 新建目录</center>
2、新建python3文件，并重命名为face\_recognition。
<center>![](/upload/Markdown/2020/0218/15820195572762.png)
图8 新建文件
![](/upload/imagePath/5dc90b6f510e8.png)
图9 文件重命名</center>

3、在Cell单元下添加如下所示的包和库文件。
```python
import pandas as pd
import cv2
import numpy as np
from keras import layers
from keras.layers import Input,Dense,Activation,ZeroPadding2D,\
    BatchNormalization,Flatten,Conv2D,AveragePooling2D,MaxPooling2D,Dropout
import os
import keras
from keras.models import Model
import keras.backend as K
K.set_image_data_format("channels_last")
K.set_learning_phase(1)
from keras.callbacks import ModelCheckpoint
seed = 7
np.random.seed(seed)
from keras.callbacks import ReduceLROnPlateau
from keras.initializers import glorot_uniform
import pdb
import string
import tensorflow as tf
```
4、设定图片长宽，路径，训练次数。原图像是像素为80\*80的3通道彩色图像。数据集被保存在train文件下。
```python

img_width, img_height = 80, 80

train_data_dir = '/dataset/TensorFlow/FERET/'
nb_epoch = 20
```
5、定义ResNet的恒等残差模块。下图18所定义函数有5个参数，f定义了主路径第二部分卷积核的大小，filters定义了主路径三个卷积运算的通道数，即F1、F2和F3。保存X_shortcut的值，作为shortcut路径。该函数定义了三个卷积操作，主路径第一部分和第三部分起到降维和升维的作用，padding值“valid”和“same”在这一过程中没有作用，因为strides的值始终为（1，1），特征图大小不会改变。利用layers.add（）计算残差和。
```pyton

#恒等模块——identity_block
def identity_block(X,f,filters,stage,block):
    """
    三层的恒等残差块
    param :
    X -- 输入的张量，维度为（m, n_H_prev, n_W_prev, n_C_prev）
    f -- 整数，指定主路径的中间 CONV 窗口的形状
    filters -- python整数列表，定义主路径的CONV层中的过滤器数目
    stage -- 整数，用于命名层，取决于它们在网络中的位置
    block --字符串/字符，用于命名层，取决于它们在网络中的位置
    return:
    X -- 三层的恒等残差块的输出，维度为：(n_H, n_W, n_C)
    """
    #定义基本的名字
    conv_name_base = "res"+str(stage)+block+"_branch"
    bn_name_base = "bn"+str(stage)+block+"_branch"
 
    #过滤器
    F1,F2,F3 = filters
 
    #保存输入值,后面将需要添加回主路径
    X_shortcut = X
 
    #主路径第一部分
    X = Conv2D(filters=F1,kernel_size=(1,1),strides=(1,1),padding="valid",
               name=conv_name_base+"2a",kernel_initializer=glorot_uniform(seed=0))(X)
    X = BatchNormalization(axis=3,name=bn_name_base+"2a")(X)
    X = Activation("relu")(X)
    # 主路径第二部分
    X = Conv2D(filters=F2,kernel_size=(f,f),strides=(1,1),padding="same",
               name=conv_name_base+"2b",kernel_initializer=glorot_uniform(seed=0))(X)
    X = BatchNormalization(axis=3,name=bn_name_base+"2b")(X)
    X = Activation("relu")(X)
    # 主路径第三部分
    X = Conv2D(filters=F3,kernel_size=(1,1),strides=(1,1),padding="valid",
               name=conv_name_base+"2c",kernel_initializer=glorot_uniform(seed=0))(X)
    X = BatchNormalization(axis=3,name=bn_name_base+"2c")(X)
 
    # 主路径最后部分,为主路径添加shortcut并通过relu激活
    X = layers.add([X,X_shortcut])
    X = Activation("relu")(X)
 
    return X
 
```
6、定义ResNet的卷积残差模块。该模块与恒等残差模块类似，不同之处是特征图的大小需要缩小1/2，该过程在主路径的第一部分完成，即strides=(s,s)，设置卷积步长为2。主路径第一部分padding为“valid”。
```python
#卷积残差块——convolutional_block
def convolutional_block(X,f,filters,stage,block,s=2):
    """
    param :
    X -- 输入的张量，维度为（m, n_H_prev, n_W_prev, n_C_prev）
    f -- 整数，指定主路径的中间 CONV 窗口的形状（过滤器大小，ResNet中f=3）
    filters -- python整数列表，定义主路径的CONV层中过滤器的数目
    stage -- 整数，用于命名层，取决于它们在网络中的位置
    block --字符串/字符，用于命名层，取决于它们在网络中的位置
    s -- 整数，指定使用的步幅
    return:
    X -- 卷积残差块的输出，维度为：(n_H, n_W, n_C)
    """
    # 定义基本的名字
    conv_name_base = "res" + str(stage) + block + "_branch"
    bn_name_base = "bn" + str(stage) + block + "_branch"
 
    # 过滤器
    F1, F2, F3 = filters
 
    # 保存输入值,后面将需要添加回主路径
    X_shortcut = X
 
    # 主路径第一部分
    X = Conv2D(filters=F1, kernel_size=(1, 1), strides=(s, s), padding="valid",
               name=conv_name_base + "2a", kernel_initializer=glorot_uniform(seed=0))(X)
    X = BatchNormalization(axis=3, name=bn_name_base + "2a")(X)
    X = Activation("relu")(X)
    # 主路径第二部分
    X = Conv2D(filters=F2, kernel_size=(f, f), strides=(1, 1), padding="same",
               name=conv_name_base + "2b", kernel_initializer=glorot_uniform(seed=0))(X)
    X = BatchNormalization(axis=3, name=bn_name_base + "2b")(X)
    X = Activation("relu")(X)
    # 主路径第三部分
    X = Conv2D(filters=F3, kernel_size=(1, 1), strides=(1, 1), padding="valid",
               name=conv_name_base + "2c", kernel_initializer=glorot_uniform(seed=0))(X)
    X = BatchNormalization(axis=3, name=bn_name_base + "2c")(X)
 
    #shortcut路径
    X_shortcut = Conv2D(filters=F3,kernel_size=(1,1),strides=(s,s),padding="valid",
               name=conv_name_base+"1",kernel_initializer=glorot_uniform(seed=0))(X_shortcut)
    X_shortcut = BatchNormalization(axis=3,name=bn_name_base+"1")(X_shortcut)
 
    # 主路径最后部分,为主路径添加shortcut并通过relu激活
    X = layers.add([X, X_shortcut])
    X = Activation("relu")(X)
 
    return X
```
7、搭建50层resnet模型，设置resnet基本模型模块。首先定义模型的输入为X_imput，ZeroPadding2D扩展该值大小为86\*86，上下左右对称扩展，或者可以写为（（3，3），（3，3）），Conv2D卷积得到64维特征图，但特征图大小减小1/2，去除边缘为零的值尺寸维度为41\*41，最大值池化后，大小为20\*20。可利用pdb.set_trace()添加断点，输入“c”在断点出继续运行程序直到下一个断点。卷积残差和恒等残差处理后，利用AveragePooling2D（）平均池化，Flatten()展开，得到2048大小的全连接层。因为人脸共有200个类别，利用Dense()可实现这一转化。Dense实现了运算output = activation(dot(input, kernel)+bias)，和Tensorflow框架下的全连接层相同，但是简化了我们的操作。“Softmax”为归一化指数函数，这样才能与上文中生成的独热码标签对应。Model()定义模型的输入和输出。
```python
 
#50层ResNet模型构建
def ResNet50(input_shape = (229,229,3),classes = 61):
    """
    构建50层的ResNet,结构为：
    CONV2D -> BATCHNORM -> RELU -> MAXPOOL -> CONVBLOCK -> IDBLOCK*2 -> CONVBLOCK -> IDBLOCK*3
    -> CONVBLOCK -> IDBLOCK*5 -> CONVBLOCK -> IDBLOCK*2 -> AVGPOOL -> TOPLAYER
    param :
    input_shape -- 数据集图片的维度
    classes -- 整数，分类的数目
    return:
    model -- Keras中的模型实例
    """
    #将输入定义为维度大小为 input_shape的张量
    X_input = Input(input_shape)
 
    # Zero-Padding
    X = ZeroPadding2D((3,3))(X_input)
 
    # Stage 1
    X = Conv2D(64,kernel_size=(5,5),strides=(2,2),name="conv1",kernel_initializer=glorot_uniform(seed=0))(X)
    X = BatchNormalization(axis=3,name="bn_conv1")(X)
    X = Activation("relu")(X)
    X = MaxPooling2D(pool_size=(3,3),strides=(2,2))(X)
    # Stage 2
    X = convolutional_block(X,f=3,filters=[64,64,256],stage=2,block="a",s=1)
    X = identity_block(X,f=3,filters=[64,64,256],stage=2,block="b")
    X = identity_block(X,f=3,filters=[64,64,256],stage=2,block="c")
    X = Dropout(0.2)(X)
    #Stage 3
    X = convolutional_block(X,f=3,filters=[128,128,512],stage=3,block="a",s=2)
    X = identity_block(X,f=3,filters=[128,128,512],stage=3,block="b")
    X = identity_block(X,f=3,filters=[128,128,512],stage=3,block="c")
    X = identity_block(X,f=3,filters=[128,128,512],stage=3,block="d")
    X = Dropout(0.2)(X)
    # Stage 4
    X = convolutional_block(X,f=3,filters=[256,256,1024],stage=4,block="a",s=2)
    X = identity_block(X,f=3,filters=[256,256,1024],stage=4,block="b")
    X = identity_block(X,f=3,filters=[256,256,1024],stage=4,block="c")
    X = identity_block(X,f=3,filters=[256,256,1024],stage=4,block="d")
    X = identity_block(X,f=3,filters=[256,256,1024],stage=4,block="e")
    X = identity_block(X,f=3,filters=[256,256,1024],stage=4,block="f")
    X = Dropout(0.2)(X)
    #Stage 5
    X = convolutional_block(X,f=3,filters=[512,512,2048],stage=5,block="a",s=2)
    X = identity_block(X,f=3,filters=[256,256,2048],stage=5,block="b")
    X = identity_block(X,f=3,filters=[256,256,2048],stage=5,block="c")
    #pdb.set_trace()
    #最后阶段
    #平均池化
    X = AveragePooling2D(pool_size=(2,2))(X)
    #pdb.set_trace()
    #输出层
    X = Flatten()(X)
    #pdb.set_trace()
    X = Dense(classes, activation='softmax', name='fc61')(X)
    
    #sess=tf.Session()
    #sess.run(tf.global_variables_initializer())
    #img = sess.run(X[0])
    #pdb.set_trace()
    
    #创建模型
    model = Model(inputs=X_input,outputs=X,name="ResNet50")
 
    return model
 
```
8、上文中得到最大值池化的特征图，输入[64,64,256]的卷积残差和恒等残差模块，[128,128,512]、[256,256,512] 、[256,256,1024] 、[512,512,2048]与其类似，但需要注意s参数的变化，在第一个卷积残差和恒等残差模块中s=1，特征图尺寸没有降维，此后降为1/2。
<center>![](/upload/imagePath/5dc90d5b2f3a2.png)
图11 特征图维度变化</center>


9、Adam为优化器，该优化器学习速率为lr。ReduceLROnPlateau用于当学习停滞时，减少2倍或10倍的学习率以获得较好的效果。categorical_crossentropy 计算输出张量和目标张量的类别交叉熵。
```python
#运行构建的模型图
model = ResNet50(input_shape=(img_width,img_height,3),classes=200)
Adam=keras.optimizers.Adam(lr=0.0001)
learning_rate_reduction = ReduceLROnPlateau(monitor='val_acc', patience=2, verbose=1, factor=0.1, min_lr=0.00000001)
model.compile(optimizer=Adam, loss='categorical_crossentropy',metrics=['accuracy'])
```
10、新建Cell，添加如下所示的内容。读取数据集，数据集一共包含了200个人的人脸图片，每个人又有7张不同的人脸图片，所以共有1400张图片数据集和200个标签类别。Dirnames为数据集的200个子目录，遍历该路径并通过append函数保存在img_path中。定义readData（）函数，从子目录中遍历每一张图片，图片格式为.tif。得到imgs为一个1400\*80\*80\*3大小的列表，labs为1400大小的子目录地址列表，其中有6/7个地址是相同的，属于同一类。
```python

#加载数据集
img_path=[]
def loadpath(input_dir):
    for (path, dirnames, filenames) in os.walk(input_dir):
        for dirname in dirnames:
            img_path.append(path+'/'+dirname)
        return img_path

path= loadpath(train_data_dir)
imgs=[]
imgs_test=[]
labs=[]
labs_test=[]
def readData(paths):
    for path in paths:
        for filename in (os.listdir(path)):
            #
            filename2 = filename
            if (filename.endswith('.tif')  and (filename.find('07.tif')==-1)):
                filename = path + '/' + filename
                print(filename)
                img = cv2.imread(filename)
                imgs.append(img)
                labs.append(path)
            
            if (filename2.endswith('.tif') and (filename2.find('07.tif')!=-1)):
                filename2 = path + '/' + filename2
                print(filename2)
                img = cv2.imread(filename2)
                imgs_test.append(img)
                labs_test.append(path)
                

readData(path)
```
11、以上实现了数据集的读取，即获得了imgs，通过np.array(imgs)矩阵化。但labs仍然以路径字符串的方式保存，需要将其转化为整数数组类型。借助pands库的get_dummies（）函数，得到如下图17所示的独热码标签，在正确的类别上值被设置为1，否则为0。
```python
#数据录入处理
for lab in labs:
    for i in range(len(path)):
        if lab ==  path[i]:
            lab=i+1

imgs = np.array(imgs)
data_dummy=pd.get_dummies(labs)
labs = np.array(data_dummy)
imgs_test = np.array(imgs_test)
data_dummy=pd.get_dummies(labs_test)
labs_test = np.array(data_dummy)
```
12、产生测试集、训练集，并归一化。
```python
# 随机划分测试集与训练集
size=80
import random
from sklearn.model_selection import train_test_split
import numpy as np
train_x,test_x = imgs,imgs_test
train_y,test_y = labs,labs_test
# 参数：图片数据的总数，图片的高、宽、通道
train_x = train_x.reshape(train_x.shape[0], size, size, 3)

test_x = test_x.reshape(test_x.shape[0], size, size, 3)
# 将数据转换成小于1的数
train_x = train_x.astype('float32')/255.0
test_x = test_x.astype('float32')/255.0
print('train size:%s, test size:%s' % (len(train_x), len(test_x)))
```
13、ModelCheckpoint回调函数将在每个epoch后保存模型，验证集正确率将作为评判的准则，将只保存在验证集上性能最好的模型。保存模型在当前/data目录下。
```python

checkpoint = ModelCheckpoint('weights.hdf5', monitor='val_acc', verbose=1, save_best_only=True, mode='max', period=1)
#训练模型
model.fit(train_x, train_y, epochs=150, batch_size=25,callbacks=[checkpoint,learning_rate_reduction])
model.save(os.path.join('./', 'my_model_resnet.h5'))
#测试数据集在模型下的正确率

y=model.predict(test_x,batch_size=25,verbose=0);
print(y);
output = np.array(y)
right = 0.0
for i in range(200):
    index=output[i].argmax()
    var=output[i]
    var[var>=var[index]]=1
    var[var< var[index]]=0
    #pdb.set_trace()
    if((var == labs_test[i]).all()):
        right += 1
right_rate = right / 200
print("正确率为：%f"%right_rate)
```
14、在测试集下得到如下所示的输出结果。
<center>![](/upload/imagePath/5dc90e9a93ed2.png)
图12预测输出
![](/upload/imagePath/5dc90f0cc7e71.png)
图13预测输出</center>
15、准确率计算。因为采用softmax的分类方法，因此取最大概率值作为分类结果，得到如下图14所示的100%正确率。
<center>![](/upload/imagePath/5dc90f3f5f739.png)
图14 准确率计算</center>
16、以上采用了人脸的全部图像训练，并使用每个人脸的最后一张图片测试得到了100%的正确率。更为一般的情况是使用每个人脸的前6张图片训练，并使用最后1张图片测试，因为每个人脸的数据集较少，因此正确率不会太高。如果按照200个人脸来计算，一张图片被随机分类正确的概率为1/200=0.5% < 31%，因此该模型可以提高人脸的识别概率。
<center>
![](/upload/imagePath/5dc90f606d511.png)
图15 测试结果</center>


####5.2、GPU性能测试
1、通过nvidia-smi指令可以查看gpu使用情况，在安装GPU版本的TensorFlow下，Keras将自动调用可用的GPU。
<center>![](/upload/imagePath/5dc90fb38d0ac.png)
图17 GPU使用</center>
2、在import库前面添加os系统设置，禁用GPU的使用，再次训练模型，得到图18所示的训练结果，可见，在使用GPU的情况下，训练速度较CPU快了20倍。
<center>![](/upload/imagePath/5dc90fc9dc88a.png)
图18 禁用GPU
![](/upload/imagePath/5dc90fd8995d5.png)
图19 CPU训练结果</center>

####5.3、人脸数据集采集
1、以上完成了人脸的分类，但是人脸识别包括了人脸检测和人脸分类，目前人脸检测已经非常成熟，所以并不准备自己编写卷积网络实现人脸检测，而是调用已经训练好的模型来实现。新建python文件“faceRecognition.py”，并添加如下图20所示的库文件。拷贝相关的模型和美剧。
```python
import os
import random
import numpy as np
import cv2
from imutils.video import VideoStream
import imutils
import time
from keras.models import load_model
nameClass = ['brother','father','mother','sheldon','sister']
model = load_model(os.path.join('./', 'my_model_resnet.h5'))
```
2、定义detection_class函数，该函数将检测到的人脸用于分类模型的输入，模型将输出分类的结果，并对应到正确的人物角色中，即图42中的if条件语句。
```python
def detection_class(image):
    
    #测试数据集在模型下的正确率
    size =80
    test_x = image.reshape(1, size, size, 3)
    # 将数据转换成小于1的数
    test_x = test_x.astype('float32')/255.0
    y=model.predict(test_x,batch_size=1,verbose=0)
    output = np.array(y)
    index=output.argmax()
    if index == 0:
        return nameClass[0]
    elif index==1:
        return nameClass[1]
    elif index==2:
        return nameClass[2]
    elif index==3:
        return nameClass[3]
    else:
        return nameClass[4]

```
3、现在编写函数getfacefromecamera，该函数读取人脸检测模型，并从美剧视频中读取一帧，作用于模型的输入，该模型将返回检测到的人脸结果和位置。需要注意的是，在人脸分类中，模型的输入为80\*80像素大小。使用人脸检测来获取数据集。
```python

def getfacefromcamera(outdir,filename):
    createdir(outdir)
    net = cv2.dnn.readNetFromCaffe('/dataset/TensorFlow/deploy.prototxt', '/dataset/TensorFlow/res10_300x300_ssd_iter_140000.caffemodel')
    vs = cv2.VideoCapture(filename)
    #Stream(filename).start()

    n = 1
    while 1:
        
        ret,frame = vs.read()
        if (frame is None):
            break
        else:
            frame = imutils.resize(frame, width=1000)
            (h, w) = frame.shape[:2]
            blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
                                         (300, 300), (104.0, 177.0, 123.0))
            net.setInput(blob)
            detections = net.forward()
            for i in range(0, detections.shape[2]):
                confidence = detections[0, 0, i, 2]
                if confidence < 0.5:
                    continue    
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                text = "{:.2f}%".format(confidence * 100)
                y = startY - 10 if startY - 10 > 10 else startY + 10
            
                face = frame[startY:endY, startX:endX]
                face = cv2.resize(face, (80, 80))

                #strname=detection_class(face)
                
                cv2.rectangle(frame, (startX, startY), (endX, endY),
                              (0, 0, 255), 2)
                #cv2.putText(frame, strname+text, (startX, y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)

                cv2.imwrite(os.path.join(outdir, str(n)+'.jpg'), face)
                n+=1    
            cv2.imshow("Frame", frame)
            key = cv2.waitKey(1) & 0xFF
            # if the `q` key was pressed, break from the loop
            if key == ord("q"):
                break 
            
                
                
    cv2.destroyAllWindows()
```
4、运行以上的程序，最终得到如下图所示的人脸检测结果。
```python
if __name__ == '__main__':
    #训练模型
    name = "face"
    #input('please input yourename: ')""
    getfacefromcamera(os.path.join('faces', name),'/dataset/TensorFlow/faceDetection.mp4')
    #测试模型,加载已经训练 好的模型
    
```
<center>![](/upload/imagePath/5dc911cb306f8.png)
图20 人脸置信度</center>

####5.4、人脸分类识别
1、以上实验完成了人脸的检测，并且人脸的尺寸被修改为了上文中的80\*80像素大小。在“/data/faces”目录下，手动将数据集分为5个子文件夹，每个文件下为对应的人脸数据。从face中分别找到对应brother的40张图片，并将文件中的前五张图片重命名为1、2、3、4、5。如下图所示，其于四个文件夹均作该处理，最后删除掉其中的“/data/faces/face”文件夹。
<center>![](/upload/imagePath/5dc911ffe3b1c.png)
图21 数据集创建
![](/upload/imagePath/5dc9120bd135a.png)
图22 数据集创建</center>


2、通过观察，发现数据集的图片命名不是按照标准的阿拉伯数字排序，而是杂乱的，为了不必要的人力浪费，我们修改上文中分类程序，使其不按照阿拉伯数字读取图片训练，并且程序只是用其中的训练部分，测试将在下文步骤中给出，如下图所示。修改face_recognition文件，如下所示:
```python
import pandas as pd
import cv2
import numpy as np
from keras import layers
from keras.layers import Input,Dense,Activation,ZeroPadding2D,\
    BatchNormalization,Flatten,Conv2D,AveragePooling2D,MaxPooling2D,Dropout
import os
import keras
from keras.models import Model
import keras.backend as K
K.set_image_data_format("channels_last")
K.set_learning_phase(1)
from keras.callbacks import ModelCheckpoint
seed = 7
np.random.seed(seed)
from keras.callbacks import ReduceLROnPlateau
from keras.initializers import glorot_uniform
import pdb
import string
import tensorflow as tf

img_width, img_height = 80, 80

train_data_dir = './face/'
nb_epoch = 20
```
3、需改Epoch为10，classes为5等参数，如下所示，并开始训练过程，得到如下图23所示的输出，训练准确率高于89%，而在测试集，准确率也高于70%。
```python
labs_test=[]
def readData(paths):
    for path in paths:
        for filename in (os.listdir(path)):
            #
            filename2 = filename
            if (filename.endswith('.tif')  and (filename.find('07.tif')==-1)):
                filename = path + '/' + filename
                print(filename)
                img = cv2.imread(filename)
                imgs.append(img)
                labs.append(path)
            
            if (filename2.endswith('.tif') and (filename2.find('07.tif')!=-1)):
                filename2 = path + '/' + filename2
                print(filename2)
                img = cv2.imread(filename2)
                imgs_test.append(img)
                labs_test.append(path)
                

readData(path)
```

```python
model = ResNet50(input_shape=(img_width,img_height,3),classes=20)
Adam=keras.optimizers.Adam(lr=0.0001)
learning_rate_reduction = ReduceLROnPlateau(monitor='val_acc', patience=2, verbose=1, factor=0.1, min_lr=0.00000001)
model.compile(optimizer=Adam, loss='categorical_crossentropy',metrics=['accuracy'])
```

```python

checkpoint = ModelCheckpoint('weights.hdf5', monitor='val_acc', verbose=1, save_best_only=True, mode='max', period=1)
#训练模型
model.fit(train_x, train_y, epochs=150, batch_size=25,callbacks=[checkpoint,learning_rate_reduction])
model.save(os.path.join('./', 'my_model_resnet.h5'))
#测试数据集在模型下的正确率
```
```python

y=model.predict(test_x,batch_size=25,verbose=0);
print(y);
output = np.array(y)
right = 0.0
for i in range(5):
    index=output[i].argmax()
    var=output[i]
    var[var>=var[index]]=1
    var[var< var[index]]=0
    #pdb.set_trace()
    if((var == labs_test[i]).all()):
        right += 1
right_rate = right / 5
print("正确率为：%f"%right_rate)
```
<center>![](/upload/imagePath/5dc9127388ef1.png)
图23 训练结果</center>

4、等待以上结果完成以后，修改人脸分类程序faceDetection如下所示，再次运行人脸识别程序，得到如下图24、25所示的结果。

```python
def getfacefromcamera(outdir,filename):
    createdir(outdir)
    net = cv2.dnn.readNetFromCaffe('/dataset/TensorFlow/deploy.prototxt', '/dataset/TensorFlow/res10_300x300_ssd_iter_140000.caffemodel')
    vs = cv2.VideoCapture(filename)
    #Stream(filename).start()

    n = 1
    while 1:
        
        ret,frame = vs.read()
        if (frame is None):
            break
        else:
            frame = imutils.resize(frame, width=1000)
            (h, w) = frame.shape[:2]
            blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
                                         (300, 300), (104.0, 177.0, 123.0))
            net.setInput(blob)
            detections = net.forward()
            for i in range(0, detections.shape[2]):
                confidence = detections[0, 0, i, 2]
                if confidence < 0.5:
                    continue    
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                text = "{:.2f}%".format(confidence * 100)
                y = startY - 10 if startY - 10 > 10 else startY + 10
            
                face = frame[startY:endY, startX:endX]
                face = cv2.resize(face, (80, 80))

                strname=detection_class(face)
                
                cv2.rectangle(frame, (startX, startY), (endX, endY),
                              (0, 0, 255), 2)
                cv2.putText(frame, strname+text, (startX, y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)

                cv2.imwrite(os.path.join(outdir, str(n)+'.jpg'), face)
                n+=1    
            cv2.imshow("Frame", frame)
            key = cv2.waitKey(1) & 0xFF
            # if the `q` key was pressed, break from the loop
            if key == ord("q"):
                break 
            
                
                
    cv2.destroyAllWindows()
```
<center>![](/upload/imagePath/5dc9127faa423.png)
图24 人脸识别结果
![](/upload/imagePath/5dc9128fa9609.png)
图25 人脸识别结果</center>


###六、扩展实验
以上实现了ResNet 50网络在FERET人脸数据库下的识别，可以看到经过多个Epoch后识别正确率提高。在YOLO V3模型下，添加了多尺度的scale融合方法，该方法类似于残差网络。可以将该思想应用于ResNet 50模型，提高模型的准确率，使得在同样的Epoch下，模型的识别率更高。最后同学可自行下载《复仇者联盟》、《绝命毒师》、《权力的游戏》等美剧，并进行人脸检测、数据集人工标注、数据集人脸分类训练、人脸识别的实验过程，得到美剧的人脸识别效果，过程如下图26所示。
<center>![](/upload/imagePath/5dc912b8a8bd0.jpg)
图26 人脸识别</center>
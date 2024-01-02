import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyAriMIe1AwyethfXRjra_Rrna68DXYH3Oc",
    authDomain: "auth-b9ba9.firebaseapp.com",
    databaseURL: "https://auth-b9ba9-default-rtdb.firebaseio.com",
    projectId: "auth-b9ba9",
    storageBucket: "auth-b9ba9.appspot.com",
    messagingSenderId: "463113484478",
    appId: "1:463113484478:web:ec4089f598083d13fb86ef"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



// Ayakkabı resimlerini getirme fonksiyonu
const fetchShoeImages = async () => {
    try {
        const storage = getStorage(app);
        const shoesCollection = collection(db, 'Ayakkabılar');
        const shoesContainer = document.getElementById('shoes-container');

        // Filtreleme butonuna tıklandığında
        document.getElementById('filterButton').addEventListener('click', async () => {
            const selectedBrand = document.querySelector('input[name="marka"]:checked');
            const selectedBrandValue = selectedBrand ? selectedBrand.value : null;

            console.log('Seçilen Marka:', selectedBrandValue);

            // Seçilen markayı kullanarak Firestore sorgusu yapın
            await filterShoesByBrand(selectedBrandValue);
        });

        // Firestore'dan ayakkabıları getir
        const querySnapshot = await getDocs(shoesCollection);
        const shoes = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            shoes.push(data);
        });

        // Ayakkabı resimleri için Promise'lar
        const imagePromises = shoes.map(async (shoe) => {
            const imgRef = ref(storage, shoe.imageUrl);
            const imgUrl = await getDownloadURL(imgRef);
            return imgUrl;
        });

        // Tüm resimleri al
        const imageUrls = await Promise.all(imagePromises);

        // Ayakkabıları sayfaya ekle
        for (let i = 0; i < shoes.length; i++) {
            const shoe = shoes[i];
            const imgUrl = imageUrls[i];

            const shoeItem = document.createElement('div');
            shoeItem.className = 'shoe-item';

            const imgElement = document.createElement('img');
            imgElement.src = imgUrl;
            imgElement.alt = 'Ayakkabı Resmi';
            imgElement.style.width = '150px';
            imgElement.style.height = '150px';
            shoeItem.appendChild(imgElement);

            const shoeDetails = document.createElement('div');
            shoeDetails.className = 'shoe-details';
            shoeDetails.innerHTML = `
                <p>Fiyat: ${shoe.fiyat}₺</p>
                <p>Marka: ${shoe.marka}</p>
                <p>Model: ${shoe.model}</p>
                <button class="buy-button">Satın Al</button>
            `;
            shoeItem.appendChild(shoeDetails);

            shoesContainer.appendChild(shoeItem);
        }
    } catch (error) {
        console.error('Ayakkabı görsellerini çekerken bir hata oluştu:', error);
    } finally {
        addBuyButtonListeners();
    }
};
const filterShoesByBrand = (marka) => {
    const shoesCollection = collection(db, 'Ayakkabılar');
    const shoesContainer = document.getElementById('shoes-container');

    // Sayfayı temizle
    shoesContainer.innerHTML = '';

    // Markaya göre sorgu
    const q = marka
        ? query(collection(db, 'Ayakkabılar'), where('marka', '==', marka))
        : shoesCollection;

    // Sorguyu gerçekleştir
    getDocs(q)
        .then((querySnapshot) => {
            console.log('Firestore Verileri:', querySnapshot.docs.map(doc => doc.data()));
            querySnapshot.forEach((doc) => {
                const data = doc.data();

                // Ayakkabıyı sayfaya ekleme kısmı (yukarıdaki kod ile aynı)
                const shoeItem = document.createElement('div');
                shoeItem.className = 'shoe-item';

                const imgElement = document.createElement('img');
                imgElement.src = data.imageUrl;
                imgElement.alt = 'Ayakkabı Resmi';
                imgElement.style.width = '150px';
                imgElement.style.height = '150px';
                shoeItem.appendChild(imgElement);

                const shoeDetails = document.createElement('div');
                shoeDetails.className = 'shoe-details';
                shoeDetails.innerHTML = `
                        <p>Fiyat: ${data.fiyat}₺</p>
                        <p>Marka: ${data.marka}</p>
                        <p>Model: ${data.model}</p>
                        <button class="buy-button">Satın Al</button>
                    `;
                shoeItem.appendChild(shoeDetails);

                shoesContainer.appendChild(shoeItem);

                // Yeni satın al butonlarına event listener ekle
                const newBuyButton = shoeItem.querySelector('.buy-button');
                newBuyButton.addEventListener('click', handleBuyButtonClick);
            });
        })
        .catch((error) => {
            console.error('Ayakkabı filtrelenirken bir hata oluştu:', error);
        });
};
function updateBuyButtonListeners() {
    try {
        const buyButtons = document.querySelectorAll('.buy-button');

        // Remove existing event listeners
        buyButtons.forEach(button => {
            button.removeEventListener('click', handleBuyButtonClick);
        });

        // Add new event listeners
        buyButtons.forEach(button => {
            button.addEventListener('click', handleBuyButtonClick);
        });
    } catch (error) {
        console.error('Satın alma butonlarına event listener eklenirken bir hata oluştu:', error);
    }
}
// Alışveriş sepet ikonu ve modal işlemleri
const shoppingCartIcon = document.querySelector('.shoppingCartButton');
const shoppingCartModal = document.getElementById('shoppingCartModal');

shoppingCartIcon.addEventListener('click', () => {
    openShoppingCartModal();
});




async function addToShoppingBag(clickedButton) {
    try {
        console.log('Satın Al button clicked');

        const shoeItem = clickedButton.closest('.shoe-item');

        if (!shoeItem) {
            console.error('Parent shoe-item not found.');
            return;
        }

        const fiyat = shoeItem.querySelector('.shoe-details p:nth-child(1)').textContent.split(': ')[1];
        const marka = shoeItem.querySelector('.shoe-details p:nth-child(2)').textContent.split(': ')[1];
        const model = shoeItem.querySelector('.shoe-details p:nth-child(3)').textContent.split(': ')[1];

        // Ayakkabı resmini alma
        const imgElement = shoeItem.querySelector('img');
        const imageUrl = imgElement ? imgElement.src : null;

        if (fiyat && marka && model && imageUrl) {
            // Sadece alışveriş sepeti ikonunu güncelle
            const productData = {
                fiyat: fiyat,
                marka: marka,
                model: model,
                imageUrl: imageUrl
            };

            console.log('Product data:', productData);

            // Check if displayShoppingCartItem is defined
            if (typeof displayShoppingCartItem === 'function') {
                displayShoppingCartItem(productData);
            } else {
                console.error('displayShoppingCartItem is not defined.');
            }
        } else {
            console.error('Gerekli öğeler bulunamadı.');
        }
    } catch (error) {
        console.error('Alışveriş sepetine ürün eklenirken bir hata oluştu:', error);
    }
}


let productData;

function displayShoppingCartItem(item) {
    try {
        const shoppingInfoContainer = document.getElementById('shoppingInfoContainer');

        if (shoppingInfoContainer) {
            const newItemContainer = document.createElement('div');
            newItemContainer.className = 'shopping-cart-item';

            // Ayakkabı resmi
            const imgElement = document.createElement('img');
            imgElement.src = item.imageUrl;
            imgElement.alt = 'Ayakkabı Resmi';
            imgElement.style.width = '50px';
            imgElement.style.height = '50px';
            newItemContainer.appendChild(imgElement);

            // Ayakkabı bilgileri
            const itemDetails = document.createElement('div');
            itemDetails.className = 'item-details';
            itemDetails.innerHTML = `
                <p>Fiyat: ${item.fiyat}</p>
                <p>Marka: ${item.marka}</p>
                <p>Model: ${item.model}</p>
            `;
            newItemContainer.appendChild(itemDetails);

            shoppingInfoContainer.appendChild(newItemContainer);

            // Alışverişi Bitir butonunu oluştur
            const finishShoppingButton = document.createElement('button');
            finishShoppingButton.className = 'finish-shopping-button';
            finishShoppingButton.textContent = 'Alışverişi Bitir';
            finishShoppingButton.addEventListener('click', finishShopping);

            // Alışveriş sepeti modunu temsil eden div
            const shoppingCartModalContent = document.querySelector('.modal-content');

            // Alışverişi Bitir butonunu modun içine ekle
            shoppingCartModalContent.appendChild(finishShoppingButton);

            window.openShoppingCartModal = openShoppingCartModal;
            window.closeShoppingCartModal = closeShoppingCartModal;

            function finishShopping() {
                // Alışverişi bitirme işlemlerini burada gerçekleştirin
                alert('Alışverişi Başarıyla Tamamladınız!');
            }

            function closeShoppingCartModal() {
                try {
                    shoppingCartModal.style.display = 'none'; // Alışveriş sepeti modalını kapat
                } catch (error) {
                    console.error('Alışveriş sepeti modalını kapatırken bir hata oluştu:', error);
                }
            }
        } else {
            console.error('Alışveriş sepeti bilgi containerı bulunamadı. HTML yapısını kontrol edin.');
        }
    } catch (error) {
        console.error('Alışveriş sepeti güncellenirken bir hata oluştu:', error);
    }
}

function openShoppingCartModal() {
    try {
        // Check if productData is defined
        if (productData) {
            displayShoppingCartItem(productData);
        } else {
            console.error('productData is not defined.');
        }

        // Check if there are items in the shopping cart
        const shoppingInfoContainer = document.getElementById('shoppingInfoContainer');
        const shoppingCartItems = shoppingInfoContainer.querySelectorAll('.shopping-cart-item');

        if (shoppingCartItems.length > 0) {
            // Alışverişi Bitir butonunu görüntüle
            const finishShoppingButton = shoppingInfoContainer.querySelector('.finish-shopping-button');
            if (finishShoppingButton) {
                finishShoppingButton.style.display = 'block';
            }

            shoppingCartModal.style.display = 'block'; // Alışveriş sepeti modalını görünür yap
        } else {
            alert('Sepette ürün bulunmamaktadır.');
            closeShoppingCartModal(); // Alışveriş sepeti modalını kapat
        }
    } catch (error) {
        console.error('Alışveriş sepeti modalını açarken bir hata oluştu:', error);
    }
}




function addBuyButtonListeners() {
    try {
        const buyButtons = document.querySelectorAll('.buy-button');

        // Remove existing event listeners
        buyButtons.forEach(button => {
            button.removeEventListener('click', handleBuyButtonClick);
        });

        // Add new event listeners
        buyButtons.forEach(button => {
            button.addEventListener('click', handleBuyButtonClick);
        });
    } catch (error) {
        console.error('Satın alma butonlarına event listener eklenirken bir hata oluştu:', error);
    }
}

// Define a separate function to handle the click event
function handleBuyButtonClick() {
    addToShoppingBag(this);
}

// Sayfa yüklendiğinde çalışacak kodlar
window.onload = async () => {
    try {
        await fetchShoeImages();
        addBuyButtonListeners();
    } catch (error) {
        console.error('Sayfa yüklenirken bir hata oluştu:', error);
    }
};